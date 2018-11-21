// @flow

import type { PushInfo } from '../push/send';
import type { UserInfos } from 'lib/types/user-types';
import {
  type RawMessageInfo,
  messageTypes,
  assertMessageType,
  type ThreadSelectionCriteria,
  type MessageTruncationStatus,
  messageTruncationStatus,
  type MessageTruncationStatuses,
  type FetchMessageInfosResult,
} from 'lib/types/message-types';
import { threadPermissions } from 'lib/types/thread-types';
import type { Viewer } from '../session/viewer';

import invariant from 'invariant';

import { notifCollapseKeyForRawMessageInfo } from 'lib/shared/notif-utils';
import {
  sortMessageInfoList,
  shimUnsupportedRawMessageInfos,
} from 'lib/shared/message-utils';
import { permissionLookup } from 'lib/permissions/thread-permissions';
import { ServerError } from 'lib/utils/errors';

import { dbQuery, SQL, mergeOrConditions } from '../database';
import { fetchUserInfos } from './user-fetchers';
import { creationString } from '../utils/idempotent';

export type CollapsableNotifInfo = {|
  collapseKey: ?string,
  existingMessageInfos: RawMessageInfo[],
  newMessageInfos: RawMessageInfo[],
|};
export type FetchCollapsableNotifsResult = {|
  usersToCollapsableNotifInfo: { [userID: string]: CollapsableNotifInfo[] },
  userInfos: UserInfos,
|};

// This function doesn't filter RawMessageInfos based on what messageTypes the
// client supports, since each user can have multiple clients. The caller must
// handle this filtering.
async function fetchCollapsableNotifs(
  pushInfo: PushInfo,
): Promise<FetchCollapsableNotifsResult> {
  // First, we need to fetch any notifications that should be collapsed
  const usersToCollapseKeysToInfo = {};
  const usersToCollapsableNotifInfo = {};
  for (let userID in pushInfo) {
    usersToCollapseKeysToInfo[userID] = {};
    usersToCollapsableNotifInfo[userID] = [];
    for (let rawMessageInfo of pushInfo[userID].messageInfos) {
      const collapseKey = notifCollapseKeyForRawMessageInfo(rawMessageInfo);
      if (!collapseKey) {
        const collapsableNotifInfo = {
          collapseKey,
          existingMessageInfos: [],
          newMessageInfos: [ rawMessageInfo ],
        };
        usersToCollapsableNotifInfo[userID].push(collapsableNotifInfo);
        continue;
      }
      if (!usersToCollapseKeysToInfo[userID][collapseKey]) {
        usersToCollapseKeysToInfo[userID][collapseKey] = {
          collapseKey,
          existingMessageInfos: [],
          newMessageInfos: [],
        };
      }
      usersToCollapseKeysToInfo[userID][collapseKey].newMessageInfos.push(
        rawMessageInfo,
      );
    }
  }

  const sqlTuples = [];
  for (let userID in usersToCollapseKeysToInfo) {
    const collapseKeysToInfo = usersToCollapseKeysToInfo[userID];
    for (let collapseKey in collapseKeysToInfo) {
      sqlTuples.push(
        SQL`(n.user = ${userID} AND n.collapse_key = ${collapseKey})`,
      );
    }
  }

  if (sqlTuples.length === 0) {
    return { usersToCollapsableNotifInfo, userInfos: {} };
  }

  const visPermissionExtractString = `$.${threadPermissions.VISIBLE}.value`;
  const collapseQuery = SQL`
    SELECT m.id, m.thread AS threadID, m.content, m.time, m.type,
      u.username AS creator, m.user AS creatorID,
      stm.permissions AS subthread_permissions, n.user, n.collapse_key
    FROM notifications n
    LEFT JOIN messages m ON m.id = n.message
    LEFT JOIN memberships mm ON mm.thread = m.thread AND mm.user = n.user
    LEFT JOIN memberships stm
      ON m.type = ${messageTypes.CREATE_SUB_THREAD}
        AND stm.thread = m.content AND stm.user = n.user
    LEFT JOIN users u ON u.id = m.user
    WHERE n.rescinded = 0 AND
      JSON_EXTRACT(mm.permissions, ${visPermissionExtractString}) IS TRUE AND
  `;
  collapseQuery.append(mergeOrConditions(sqlTuples));
  collapseQuery.append(SQL`ORDER BY m.time DESC`);
  const [ collapseResult ] = await dbQuery(collapseQuery);

  const userInfos = {};
  for (let row of collapseResult) {
    userInfos[row.creatorID] = { id: row.creatorID, username: row.creator };
    const rawMessageInfo = rawMessageInfoFromRow(row);
    if (rawMessageInfo) {
      const info = usersToCollapseKeysToInfo[row.user][row.collapse_key];
      info.existingMessageInfos.push(rawMessageInfo);
    }
  }

  for (let userID in usersToCollapseKeysToInfo) {
    const collapseKeysToInfo = usersToCollapseKeysToInfo[userID];
    for (let collapseKey in collapseKeysToInfo) {
      const info = collapseKeysToInfo[collapseKey];
      usersToCollapsableNotifInfo[userID].push({
        collapseKey: info.collapseKey,
        existingMessageInfos: sortMessageInfoList(info.existingMessageInfos),
        newMessageInfos: sortMessageInfoList(info.newMessageInfos),
      });
    }
  }

  return { usersToCollapsableNotifInfo, userInfos };
}

function rawMessageInfoFromRow(row: Object): ?RawMessageInfo {
  const type = assertMessageType(row.type);
  if (type === messageTypes.TEXT) {
    return {
      type: messageTypes.TEXT,
      id: row.id.toString(),
      threadID: row.threadID.toString(),
      time: row.time,
      creatorID: row.creatorID.toString(),
      text: row.content,
    };
  } else if (type === messageTypes.CREATE_THREAD) {
    const dbInitialThreadState = JSON.parse(row.content);
    // For legacy clients before the rename
    const initialThreadState = {
      ...dbInitialThreadState,
      visibilityRules: dbInitialThreadState.type,
    };
    return {
      type: messageTypes.CREATE_THREAD,
      id: row.id.toString(),
      threadID: row.threadID.toString(),
      time: row.time,
      creatorID: row.creatorID.toString(),
      initialThreadState,
    };
  } else if (type === messageTypes.ADD_MEMBERS) {
    return {
      type: messageTypes.ADD_MEMBERS,
      id: row.id.toString(),
      threadID: row.threadID.toString(),
      time: row.time,
      creatorID: row.creatorID.toString(),
      addedUserIDs: JSON.parse(row.content),
    };
  } else if (type === messageTypes.CREATE_SUB_THREAD) {
    const subthreadPermissions = row.subthread_permissions;
    if (!permissionLookup(subthreadPermissions, threadPermissions.KNOW_OF)) {
      return null;
    }
    return {
      type: messageTypes.CREATE_SUB_THREAD,
      id: row.id.toString(),
      threadID: row.threadID.toString(),
      time: row.time,
      creatorID: row.creatorID.toString(),
      childThreadID: row.content,
    };
  } else if (type === messageTypes.CHANGE_SETTINGS) {
    const content = JSON.parse(row.content);
    const field = Object.keys(content)[0];
    return {
      type: messageTypes.CHANGE_SETTINGS,
      id: row.id.toString(),
      threadID: row.threadID.toString(),
      time: row.time,
      creatorID: row.creatorID.toString(),
      field,
      value: content[field],
    };
  } else if (type === messageTypes.REMOVE_MEMBERS) {
    return {
      type: messageTypes.REMOVE_MEMBERS,
      id: row.id.toString(),
      threadID: row.threadID.toString(),
      time: row.time,
      creatorID: row.creatorID.toString(),
      removedUserIDs: JSON.parse(row.content),
    };
  } else if (type === messageTypes.CHANGE_ROLE) {
    const content = JSON.parse(row.content);
    return {
      type: messageTypes.CHANGE_ROLE,
      id: row.id.toString(),
      threadID: row.threadID.toString(),
      time: row.time,
      creatorID: row.creatorID.toString(),
      userIDs: content.userIDs,
      newRole: content.newRole,
    };
  } else if (type === messageTypes.LEAVE_THREAD) {
    return {
      type: messageTypes.LEAVE_THREAD,
      id: row.id.toString(),
      threadID: row.threadID.toString(),
      time: row.time,
      creatorID: row.creatorID.toString(),
    };
  } else if (type === messageTypes.JOIN_THREAD) {
    return {
      type: messageTypes.JOIN_THREAD,
      id: row.id.toString(),
      threadID: row.threadID.toString(),
      time: row.time,
      creatorID: row.creatorID.toString(),
    };
  } else if (type === messageTypes.CREATE_ENTRY) {
    const content = JSON.parse(row.content);
    return {
      type: messageTypes.CREATE_ENTRY,
      id: row.id.toString(),
      threadID: row.threadID.toString(),
      time: row.time,
      creatorID: row.creatorID.toString(),
      entryID: content.entryID,
      date: content.date,
      text: content.text,
    };
  } else if (type === messageTypes.EDIT_ENTRY) {
    const content = JSON.parse(row.content);
    return {
      type: messageTypes.EDIT_ENTRY,
      id: row.id.toString(),
      threadID: row.threadID.toString(),
      time: row.time,
      creatorID: row.creatorID.toString(),
      entryID: content.entryID,
      date: content.date,
      text: content.text,
    };
  } else if (type === messageTypes.DELETE_ENTRY) {
    const content = JSON.parse(row.content);
    return {
      type: messageTypes.DELETE_ENTRY,
      id: row.id.toString(),
      threadID: row.threadID.toString(),
      time: row.time,
      creatorID: row.creatorID.toString(),
      entryID: content.entryID,
      date: content.date,
      text: content.text,
    };
  } else if (type === messageTypes.RESTORE_ENTRY) {
    const content = JSON.parse(row.content);
    return {
      type: messageTypes.RESTORE_ENTRY,
      id: row.id.toString(),
      threadID: row.threadID.toString(),
      time: row.time,
      creatorID: row.creatorID.toString(),
      entryID: content.entryID,
      date: content.date,
      text: content.text,
    };
  } else {
    invariant(false, `unrecognized messageType ${type}`);
  }
}

const visibleExtractString = `$.${threadPermissions.VISIBLE}.value`;

async function fetchMessageInfos(
  viewer: Viewer,
  criteria: ThreadSelectionCriteria,
  numberPerThread: number,
): Promise<FetchMessageInfosResult> {
  const threadSelectionClause = threadSelectionCriteriaToSQLClause(criteria);
  const truncationStatuses = {};

  const viewerID = viewer.id;
  const query = SQL`
    SELECT * FROM (
      SELECT x.id, x.content, x.time, x.type, x.user AS creatorID,
        u.username AS creator, x.subthread_permissions,
        @num := if(@thread = x.thread, @num + 1, 1) AS number,
        @thread := x.thread AS threadID
      FROM (SELECT @num := 0, @thread := '') init
      JOIN (
        SELECT m.id, m.thread, m.user, m.content, m.time, m.type,
          stm.permissions AS subthread_permissions
        FROM messages m
        LEFT JOIN memberships mm
          ON mm.thread = m.thread AND mm.user = ${viewerID}
        LEFT JOIN memberships stm ON m.type = ${messageTypes.CREATE_SUB_THREAD}
          AND stm.thread = m.content AND stm.user = ${viewerID}
        WHERE JSON_EXTRACT(mm.permissions, ${visibleExtractString}) IS TRUE AND
  `;
  query.append(threadSelectionClause);
  query.append(SQL`
        ORDER BY m.thread, m.time DESC
      ) x
      LEFT JOIN users u ON u.id = x.user
    ) y
    WHERE y.number <= ${numberPerThread}
  `);
  const [ result ] = await dbQuery(query);

  const rawMessageInfos = [];
  const userInfos = {};
  const threadToMessageCount = new Map();
  for (let row of result) {
    const creatorID = row.creatorID.toString();
    userInfos[creatorID] = {
      id: creatorID,
      username: row.creator,
    };
    const rawMessageInfo = rawMessageInfoFromRow(row);
    if (rawMessageInfo) {
      rawMessageInfos.push(rawMessageInfo);
    }
    const threadID = row.threadID.toString();
    const currentCountValue = threadToMessageCount.get(threadID);
    const currentCount = currentCountValue ? currentCountValue : 0;
    threadToMessageCount.set(threadID, currentCount + 1);
  }

  for (let [ threadID, messageCount ] of threadToMessageCount) {
    // If there are fewer messages returned than the max for a given thread,
    // then our result set includes all messages in the query range for that
    // thread
    truncationStatuses[threadID] = messageCount < numberPerThread
      ? messageTruncationStatus.EXHAUSTIVE
      : messageTruncationStatus.TRUNCATED;
  }

  for (let rawMessageInfo of rawMessageInfos) {
    if (rawMessageInfo.type === messageTypes.CREATE_THREAD) {
      // If a CREATE_THREAD message for a given thread is in the result set,
      // then our result set includes all messages in the query range for that
      // thread
      truncationStatuses[rawMessageInfo.threadID] =
        messageTruncationStatus.EXHAUSTIVE;
    }
  }

  for (let threadID in criteria.threadCursors) {
    const cursor = criteria.threadCursors[threadID];
    const truncationStatus = truncationStatuses[threadID];
    if (truncationStatus === null || truncationStatus === undefined) {
      // If nothing was returned for a thread that was explicitly queried for,
      // then our result set includes all messages in the query range for that
      // thread
      truncationStatuses[threadID] = messageTruncationStatus.EXHAUSTIVE;
    } else if (truncationStatus === messageTruncationStatus.TRUNCATED) {
      // If a cursor was specified for a given thread, then the result is
      // guaranteed to be contiguous with what the client has, and as such the
      // result should never be TRUNCATED
      truncationStatuses[threadID] = messageTruncationStatus.UNCHANGED;
    }
  }

  const allUserInfos = await fetchAllUsers(rawMessageInfos, userInfos);
  const shimmedRawMessageInfos = shimUnsupportedRawMessageInfos(
    rawMessageInfos,
    viewer.platformDetails,
  );

  return {
    rawMessageInfos: shimmedRawMessageInfos,
    truncationStatuses,
    userInfos: allUserInfos,
  };
}

function threadSelectionCriteriaToSQLClause(criteria: ThreadSelectionCriteria) {
  const conditions = [];
  if (criteria.joinedThreads === true) {
    conditions.push(SQL`mm.role != 0`);
  }
  if (criteria.threadCursors) {
    for (let threadID in criteria.threadCursors) {
      const cursor = criteria.threadCursors[threadID];
      if (cursor) {
        conditions.push(SQL`(m.thread = ${threadID} AND m.id < ${cursor})`);
      } else {
        conditions.push(SQL`m.thread = ${threadID}`);
      }
    }
  }
  if (conditions.length === 0) {
    throw new ServerError('internal_error');
  }
  return mergeOrConditions(conditions);
}

function threadSelectionCriteriaToInitialTruncationStatuses(
  criteria: ThreadSelectionCriteria,
  defaultTruncationStatus: MessageTruncationStatus,
) {
  const truncationStatuses = {};
  if (criteria.threadCursors) {
    for (let threadID in criteria.threadCursors) {
      truncationStatuses[threadID] = defaultTruncationStatus;
    }
  }
  return truncationStatuses;
}

async function fetchAllUsers(
  rawMessageInfos: $ReadOnlyArray<RawMessageInfo>,
  userInfos: UserInfos,
): Promise<UserInfos> {
  const allAddedUserIDs = [];
  for (let rawMessageInfo of rawMessageInfos) {
    let newUsers = [];
    if (rawMessageInfo.type === messageTypes.ADD_MEMBERS) {
      newUsers = rawMessageInfo.addedUserIDs;
    } else if (rawMessageInfo.type === messageTypes.CREATE_THREAD) {
      newUsers = rawMessageInfo.initialThreadState.memberIDs;
    }
    for (let userID of newUsers) {
      if (!userInfos[userID]) {
        allAddedUserIDs.push(userID);
      }
    }
  }
  if (allAddedUserIDs.length === 0) {
    return userInfos;
  }

  const newUserInfos = await fetchUserInfos(allAddedUserIDs);
  return {
    ...userInfos,
    ...newUserInfos,
  };
}

async function fetchMessageInfosSince(
  viewer: Viewer,
  criteria: ThreadSelectionCriteria,
  currentAsOf: number,
  maxNumberPerThread: number,
): Promise<FetchMessageInfosResult> {
  const threadSelectionClause = threadSelectionCriteriaToSQLClause(criteria);
  const truncationStatuses = threadSelectionCriteriaToInitialTruncationStatuses(
    criteria,
    messageTruncationStatus.UNCHANGED,
  );

  const viewerID = viewer.id;
  const query = SQL`
    SELECT m.id, m.thread AS threadID, m.content, m.time, m.type,
      u.username AS creator, m.user AS creatorID,
      stm.permissions AS subthread_permissions
    FROM messages m
    LEFT JOIN memberships mm ON mm.thread = m.thread AND mm.user = ${viewerID}
    LEFT JOIN memberships stm ON m.type = ${messageTypes.CREATE_SUB_THREAD}
      AND stm.thread = m.content AND stm.user = ${viewerID}
    LEFT JOIN users u ON u.id = m.user
    WHERE m.time > ${currentAsOf} AND
      JSON_EXTRACT(mm.permissions, ${visibleExtractString}) IS TRUE AND
  `;
  query.append(threadSelectionClause);
  query.append(SQL`
    ORDER BY m.thread, m.time DESC
  `);
  const [ result ] = await dbQuery(query);

  const rawMessageInfos = [];
  const userInfos = {};
  let currentThreadID = null;
  let numMessagesForCurrentThreadID = 0;
  for (let row of result) {
    const threadID = row.threadID.toString();
    if (threadID !== currentThreadID) {
      currentThreadID = threadID;
      numMessagesForCurrentThreadID = 1;
      truncationStatuses[threadID] = messageTruncationStatus.UNCHANGED;
    } else {
      numMessagesForCurrentThreadID++;
    }
    if (numMessagesForCurrentThreadID <= maxNumberPerThread) {
      if (row.type === messageTypes.CREATE_THREAD) {
        // If a CREATE_THREAD message is here, then we have all messages
        truncationStatuses[threadID] = messageTruncationStatus.EXHAUSTIVE;
      }
      const creatorID = row.creatorID.toString();
      userInfos[creatorID] = {
        id: creatorID,
        username: row.creator,
      };
      const rawMessageInfo = rawMessageInfoFromRow(row);
      if (rawMessageInfo) {
        rawMessageInfos.push(rawMessageInfo);
      }
    } else if (numMessagesForCurrentThreadID === maxNumberPerThread + 1) {
      truncationStatuses[threadID] = messageTruncationStatus.TRUNCATED;
    }
  }

  const allUserInfos = await fetchAllUsers(rawMessageInfos, userInfos);
  const shimmedRawMessageInfos = shimUnsupportedRawMessageInfos(
    rawMessageInfos,
    viewer.platformDetails,
  );

  return {
    rawMessageInfos: shimmedRawMessageInfos,
    truncationStatuses,
    userInfos: allUserInfos,
  };
}

async function getMessageFetchResultFromRedisMessages(
  viewer: Viewer,
  rawMessageInfos: $ReadOnlyArray<RawMessageInfo>,
): Promise<FetchMessageInfosResult> {
  const truncationStatuses = {};
  for (let rawMessageInfo of rawMessageInfos) {
    truncationStatuses[rawMessageInfo.threadID] =
      messageTruncationStatus.UNCHANGED;
  }
  const userInfos = await fetchAllUsers(rawMessageInfos, {});
  const shimmedRawMessageInfos = shimUnsupportedRawMessageInfos(
    rawMessageInfos,
    viewer.platformDetails,
  );
  return {
    rawMessageInfos: shimmedRawMessageInfos,
    truncationStatuses,
    userInfos,
  };
}

async function fetchMessageInfoForLocalID(
  viewer: Viewer,
  localID: ?string,
): Promise<?RawMessageInfo> {
  if (!localID || !viewer.hasSessionInfo) {
    return null;
  }
  const creation = creationString(viewer, localID);
  const viewerID = viewer.id;
  const query = SQL`
    SELECT m.id, m.thread AS threadID, m.content, m.time, m.type,
      m.user AS creatorID, stm.permissions AS subthread_permissions
    FROM messages m
    LEFT JOIN memberships mm ON mm.thread = m.thread AND mm.user = ${viewerID}
    LEFT JOIN memberships stm ON m.type = ${messageTypes.CREATE_SUB_THREAD}
      AND stm.thread = m.content AND stm.user = ${viewerID}
    WHERE m.user = ${viewerID} AND m.creation = ${creation} AND
      JSON_EXTRACT(mm.permissions, ${visibleExtractString}) IS TRUE
  `;

  const [ result ] = await dbQuery(query);
  if (result.length === 0) {
    return null;
  }
  return rawMessageInfoFromRow(result[0]);
}

const entryIDExtractString = "$.entryID";
async function fetchMessageInfoForEntryCreation(
  viewer: Viewer,
  entryID: string,
  threadID: string,
): Promise<?RawMessageInfo> {
  const viewerID = viewer.id;
  const query = SQL`
    SELECT m.id, m.thread AS threadID, m.content, m.time, m.type,
      m.user AS creatorID
    FROM messages m
    LEFT JOIN memberships mm ON mm.thread = m.thread AND mm.user = ${viewerID}
    WHERE m.user = ${viewerID} AND m.thread = ${threadID} AND
      m.type = ${messageTypes.CREATE_ENTRY} AND
      JSON_EXTRACT(m.content, ${entryIDExtractString}) = ${entryID} AND
      JSON_EXTRACT(mm.permissions, ${visibleExtractString}) IS TRUE
  `;

  const [ result ] = await dbQuery(query);
  if (result.length === 0) {
    return null;
  }
  return rawMessageInfoFromRow(result[0]);
}

export {
  fetchCollapsableNotifs,
  fetchMessageInfos,
  fetchMessageInfosSince,
  getMessageFetchResultFromRedisMessages,
  fetchMessageInfoForLocalID,
  fetchMessageInfoForEntryCreation,
};
