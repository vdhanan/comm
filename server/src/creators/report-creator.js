// @flow

import type { Viewer } from '../session/viewer';
import {
  type ReportCreationRequest,
  type ReportCreationResponse,
  type ThreadPollPushInconsistencyReportCreationRequest,
  type EntryPollPushInconsistencyReportCreationRequest,
  reportTypes,
} from 'lib/types/report-types';
import { messageTypes } from 'lib/types/message-types';
import { pingResponseTypes } from 'lib/types/ping-types';

import bots from 'lib/facts/bots';
import _isEqual from 'lodash/fp/isEqual';

import { pingActionTypes } from 'lib/actions/ping-actions';
import { filterRawEntryInfosByCalendarQuery } from 'lib/shared/entry-utils';

import { dbQuery, SQL } from '../database';
import createIDs from './id-creator';
import { fetchUsername } from '../fetchers/user-fetchers';
import urlFacts from '../../facts/url';
import createMessages from './message-creator';
import { handleAsyncPromise } from '../responders/handlers';

const { baseDomain, basePath, https } = urlFacts;
const { squadbot } = bots;

async function createReport(
  viewer: Viewer,
  request: ReportCreationRequest,
): Promise<?ReportCreationResponse> {
  const shouldIgnore = await ignoreReport(viewer, request);
  if (shouldIgnore) {
    return null;
  }
  const [ id ] = await createIDs("reports", 1);
  let type, platformDetails, report, time;
  if (request.type === reportTypes.THREAD_POLL_PUSH_INCONSISTENCY) {
    ({ type, platformDetails, time, ...report } = request);
    time = time ? time : Date.now();
  } else if (request.type === reportTypes.ENTRY_POLL_PUSH_INCONSISTENCY) {
    ({ type, platformDetails, time, ...report } = request);
  } else {
    ({ type, platformDetails, ...report } = request);
    time = Date.now();
  }
  const row = [
    id,
    viewer.id,
    type,
    platformDetails.platform,
    JSON.stringify(report),
    time,
  ];
  const query = SQL`
    INSERT INTO reports (id, user, type, platform, report, creation_time)
    VALUES ${[row]}
  `;
  await dbQuery(query);
  handleAsyncPromise(sendSquadbotMessage(viewer, request, id));
  return { id };
}

async function sendSquadbotMessage(
  viewer: Viewer,
  request: ReportCreationRequest,
  reportID: string,
): Promise<void> {
  const canGenerateMessage = getSquadbotMessage(request, reportID, null);
  if (!canGenerateMessage) {
    return;
  }
  const username = await fetchUsername(viewer.id);
  const message = getSquadbotMessage(request, reportID, username);
  if (!message) {
    return;
  }
  const time = Date.now();
  await createMessages([{
    type: messageTypes.TEXT,
    threadID: squadbot.ashoatThreadID,
    creatorID: squadbot.userID,
    time,
    text: message,
  }]);
}

async function ignoreReport(
  viewer: Viewer,
  request: ReportCreationRequest,
): Promise<bool> {
  if (ignoreKnownInconsistencyReport(request)) {
    return true;
  }
  // The below logic is to avoid duplicate inconsistency reports
  if (
    request.type !== reportTypes.THREAD_POLL_PUSH_INCONSISTENCY &&
    request.type !== reportTypes.ENTRY_POLL_PUSH_INCONSISTENCY
  ) {
    return false;
  }
  const { type, platformDetails, time } = request;
  if (!time) {
    return false;
  }
  const { platform } = platformDetails;
  const query = SQL`
    SELECT id
    FROM reports
    WHERE user = ${viewer.id} AND type = ${type}
      AND platform = ${platform} AND creation_time = ${time}
  `;
  const [ result ] = await dbQuery(query);
  return result.length !== 0;
}

// Currently this only ignores cases that are the result of the thread-reducer
// conditional with the comment above that starts with "If the thread at the"
function ignoreKnownInconsistencyReport(request: ReportCreationRequest): bool {
  if (request.type !== reportTypes.THREAD_POLL_PUSH_INCONSISTENCY) {
    return false;
  }
  if (request.action.type !== pingActionTypes.success) {
    return false;
  }
  const { payload } = request.action;
  if (payload.type !== pingResponseTypes.FULL) {
    return false;
  }
  const { beforeAction, pollResult, pushResult } = request;
  const payloadThreadInfos = payload.threadInfos;
  const prevStateThreadInfos = payload.prevState.threadInfos;
  const nonMatchingThreadIDs = getInconsistentThreadIDsFromReport(request);
  for (let threadID of nonMatchingThreadIDs) {
    const newThreadInfo = payloadThreadInfos[threadID];
    const prevThreadInfo = prevStateThreadInfos[threadID];
    if (!_isEqual(prevThreadInfo)(newThreadInfo)) {
      return false;
    }
    const currentThreadInfo = beforeAction[threadID];
    const pollThreadInfo = pollResult[threadID];
    if (!_isEqual(currentThreadInfo)(pollThreadInfo)) {
      return false;
    }
    const pushThreadInfo = pushResult[threadID];
    if (!_isEqual(pushThreadInfo)(newThreadInfo)) {
      return false;
    }
  }
  return true;
}

function getSquadbotMessage(
  request: ReportCreationRequest,
  reportID: string,
  username: ?string,
): ?string {
  const name = username ? username : "[null]";
  const { platformDetails } = request;
  const { platform, codeVersion } = platformDetails;
  const platformString = codeVersion ? `${platform} v${codeVersion}` : platform;
  if (request.type === reportTypes.ERROR) {
    const protocol = https ? "https" : "http";
    return `${name} got an error :(\n` +
      `using ${platformString}\n` +
      `${baseDomain}${basePath}download_error_report/${reportID}`;
  } else if (request.type === reportTypes.THREAD_POLL_PUSH_INCONSISTENCY) {
    const nonMatchingThreadIDs = getInconsistentThreadIDsFromReport(request);
    const nonMatchingString = [...nonMatchingThreadIDs].join(", ");
    return `system detected poll/push inconsistency for ${name}!\n` +
      `using ${platformString}\n` +
      `occurred during ${request.action.type}\n` +
      `thread IDs that are inconsistent: ${nonMatchingString}`;
  } else if (request.type === reportTypes.ENTRY_POLL_PUSH_INCONSISTENCY) {
    const nonMatchingEntryIDs = getInconsistentEntryIDsFromReport(request);
    const nonMatchingString = [...nonMatchingEntryIDs].join(", ");
    return `system detected poll/push inconsistency for ${name}!\n` +
      `using ${platformString}\n` +
      `occurred during ${request.action.type}\n` +
      `entry IDs that are inconsistent: ${nonMatchingString}`;
  } else {
    return null;
  }
}

function findInconsistentObjectKeys(
  first: {[id: string]: Object},
  second: {[id: string]: Object},
): Set<string> {
  const nonMatchingIDs = new Set();
  for (let id in first) {
    if (!_isEqual(first[id])(second[id])) {
      nonMatchingIDs.add(id);
    }
  }
  for (let id in second) {
    if (!first[id]) {
      nonMatchingIDs.add(id);
    }
  }
  return nonMatchingIDs;
}

function getInconsistentThreadIDsFromReport(
  request: ThreadPollPushInconsistencyReportCreationRequest,
): Set<string> {
  const { pushResult, pollResult, action } = request;
  return findInconsistentObjectKeys(pollResult, pushResult);
}

function getInconsistentEntryIDsFromReport(
  request: EntryPollPushInconsistencyReportCreationRequest,
): Set<string> {
  const { pushResult, pollResult, action, calendarQuery } = request;
  const filteredPollResult = filterRawEntryInfosByCalendarQuery(
    pollResult,
    calendarQuery,
  );
  const filteredPushResult = filterRawEntryInfosByCalendarQuery(
    pushResult,
    calendarQuery,
  );
  return findInconsistentObjectKeys(filteredPollResult, filteredPushResult);
}

export default createReport;
