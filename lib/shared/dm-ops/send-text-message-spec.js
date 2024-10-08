// @flow

import type {
  DMOperationSpec,
  ProcessDMOperationUtilities,
} from './dm-op-spec.js';
import type { DMSendTextMessageOperation } from '../../types/dm-ops.js';
import { messageTypes } from '../../types/message-types-enum.js';
import type { ClientUpdateInfo } from '../../types/update-types.js';
import { rawMessageInfoFromMessageData } from '../message-utils.js';

function createMessageDataFromDMOperation(
  dmOperation: DMSendTextMessageOperation,
) {
  const { threadID, creatorID, time, text } = dmOperation;
  return {
    type: messageTypes.TEXT,
    threadID,
    creatorID,
    time,
    text,
  };
}

const sendTextMessageSpec: DMOperationSpec<DMSendTextMessageOperation> =
  Object.freeze({
    notificationsCreationData: async (
      dmOperation: DMSendTextMessageOperation,
    ) => {
      const messageData = createMessageDataFromDMOperation(dmOperation);
      return { messageDatas: [messageData] };
    },
    processDMOperation: async (dmOperation: DMSendTextMessageOperation) => {
      const { messageID } = dmOperation;
      const messageData = createMessageDataFromDMOperation(dmOperation);
      const rawMessageInfos = [
        rawMessageInfoFromMessageData(messageData, messageID),
      ];
      const updateInfos: Array<ClientUpdateInfo> = [];
      return {
        rawMessageInfos,
        updateInfos,
      };
    },
    canBeProcessed(
      dmOperation: DMSendTextMessageOperation,
      viewerID: string,
      utilities: ProcessDMOperationUtilities,
    ) {
      if (utilities.threadInfos[dmOperation.threadID]) {
        return { isProcessingPossible: true };
      }
      return {
        isProcessingPossible: false,
        reason: {
          type: 'missing_thread',
          threadID: dmOperation.threadID,
        },
      };
    },
    supportsAutoRetry: false,
  });

export { sendTextMessageSpec };
