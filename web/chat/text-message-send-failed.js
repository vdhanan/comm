// @flow

import type { ChatMessageInfoItem } from 'lib/selectors/chat-selectors.js';
import { textMessageSendFailed as sharedTextMessageSendFailed } from 'lib/shared/chat-utils.js';
import { messageTypes } from 'lib/types/message-types-enum.js';

export default function textMessageSendFailed(
  item: ChatMessageInfoItem,
): boolean {
  const { messageInfo, localMessageInfo } = item;

  if (messageInfo.type !== messageTypes.TEXT) {
    return false;
  }

  return sharedTextMessageSendFailed(messageInfo, localMessageInfo);
}
