// @flow

import invariant from 'invariant';
import * as React from 'react';
import stringHash from 'string-hash';

import { selectedThreadColors } from './color-utils.js';
import { threadOtherMembers } from './thread-utils.js';
import genesis from '../facts/genesis.js';
import { useENSAvatar } from '../hooks/ens-cache.js';
import { getETHAddressForUserInfo } from '../shared/account-utils.js';
import type {
  ClientAvatar,
  ClientEmojiAvatar,
  GenericUserInfoWithAvatar,
  ResolvedClientAvatar,
} from '../types/avatar-types.js';
import type {
  ThreadInfo,
  RawThreadInfo,
} from '../types/minimally-encoded-thread-permissions-types.js';
import { threadTypes } from '../types/thread-types-enum.js';
import type { UserInfos } from '../types/user-types.js';

const defaultAnonymousUserEmojiAvatar: ClientEmojiAvatar = {
  color: selectedThreadColors[4],
  emoji: '👤',
  type: 'emoji',
};

const defaultEmojiAvatars: $ReadOnlyArray<ClientEmojiAvatar> = [
  { color: selectedThreadColors[0], emoji: '😀', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '😃', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '😄', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '😁', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '😆', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🙂', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '😉', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '😊', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '😇', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🥰', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '😍', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🤩', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '🥳', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '😝', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '😎', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🧐', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🥸', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '🤗', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '😤', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🤯', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🤔', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🫡', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🤫', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '😮', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '😲', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🤠', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🤑', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '👩‍🚀', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🥷', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '👻', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '👾', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🤖', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '😺', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '😸', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '😹', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '😻', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🎩', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '👑', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🐶', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🐱', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🐭', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '🐹', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🐰', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🐻', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🐼', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🐻‍❄️', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🐨', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🐯', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🦁', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🐸', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🐔', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🐧', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🐦', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🐤', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🦄', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🐝', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🦋', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🐬', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🐳', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🐋', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '🦈', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🦭', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🐘', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🦛', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🐐', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🐓', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🦃', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🦩', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🦔', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🐅', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🐆', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🦓', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🦒', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🦘', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🐎', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🐕', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🐩', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🦮', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🐈', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🦚', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🦜', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🦢', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🕊️', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🐇', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🦦', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🐿️', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🐉', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🌴', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🌱', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '☘️', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '🍀', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🍄', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🌿', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🪴', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🍁', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '💐', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🌷', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🌹', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🌸', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🌻', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '⭐', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🌟', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🍏', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🍎', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🍐', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🍊', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🍋', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🍓', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🫐', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '🍈', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🍒', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🥭', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🍍', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🥝', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🍅', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🥦', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🥕', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🥐', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🥯', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🍞', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '🥖', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🥨', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🧀', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🥞', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🧇', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🥓', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🍔', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🍟', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🍕', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🥗', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '🍝', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🍜', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🍲', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🍛', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🍣', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🍱', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🥟', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🍤', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🍙', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🍚', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '🍥', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🍦', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🧁', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🍭', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🍩', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🍪', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '☕️', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🍵', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '⚽️', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🏀', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🏈', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '⚾️', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🥎', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🎾', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🏐', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🏉', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '🎱', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🏆', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🎨', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🎤', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '🎧', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🎼', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🎹', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🥁', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🎷', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🎺', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🎸', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🪕', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🎻', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🎲', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '♟️', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🎮', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🚗', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '🚙', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🚌', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🏎️', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🛻', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🚚', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🚛', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🚘', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🚀', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🚁', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🛶', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '⛵️', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🚤', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '⚓', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🏰', type: 'emoji' },
  { color: selectedThreadColors[0], emoji: '🎡', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '💎', type: 'emoji' },
  { color: selectedThreadColors[2], emoji: '🔮', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '💈', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🧸', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🎊', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🎉', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🪩', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🚂', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '🚆', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🚊', type: 'emoji' },
  { color: selectedThreadColors[1], emoji: '🛰️', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '🏠', type: 'emoji' },
  { color: selectedThreadColors[3], emoji: '⛰️', type: 'emoji' },
  { color: selectedThreadColors[4], emoji: '🏔️', type: 'emoji' },
  { color: selectedThreadColors[5], emoji: '🗻', type: 'emoji' },
  { color: selectedThreadColors[6], emoji: '🏛️', type: 'emoji' },
  { color: selectedThreadColors[7], emoji: '⛩️', type: 'emoji' },
  { color: selectedThreadColors[8], emoji: '🧲', type: 'emoji' },
  { color: selectedThreadColors[9], emoji: '🎁', type: 'emoji' },
];

function getRandomDefaultEmojiAvatar(): ClientEmojiAvatar {
  const randomIndex = Math.floor(Math.random() * defaultEmojiAvatars.length);
  return defaultEmojiAvatars[randomIndex];
}

function getDefaultAvatar(hashKey: string, color?: string): ClientEmojiAvatar {
  let key = hashKey;

  const barPosition = key.indexOf('|');
  if (barPosition !== -1) {
    key = key.slice(barPosition + 1);
  }

  const avatarIndex = stringHash(key) % defaultEmojiAvatars.length;

  return {
    ...defaultEmojiAvatars[avatarIndex],
    color: color ? color : defaultEmojiAvatars[avatarIndex].color,
  };
}

function getAvatarForUser(user: ?GenericUserInfoWithAvatar): ClientAvatar {
  if (user?.avatar) {
    return user.avatar;
  }

  if (!user?.username) {
    return defaultAnonymousUserEmojiAvatar;
  }

  return getDefaultAvatar(user.username);
}

function getUserAvatarForThread(
  threadInfo: RawThreadInfo | ThreadInfo,
  viewerID: ?string,
  userInfos: UserInfos,
): ClientAvatar {
  if (threadInfo.type === threadTypes.GENESIS_PRIVATE) {
    invariant(viewerID, 'viewerID should be set for GENESIS_PRIVATE threads');
    return getAvatarForUser(userInfos[viewerID]);
  }

  invariant(
    threadInfo.type === threadTypes.GENESIS_PERSONAL,
    'threadInfo should be a GENESIS_PERSONAL type',
  );

  const memberInfos = threadOtherMembers(threadInfo.members, viewerID)
    .map(member => userInfos[member.id] && userInfos[member.id])
    .filter(Boolean);

  if (memberInfos.length === 0) {
    return defaultAnonymousUserEmojiAvatar;
  }

  return getAvatarForUser(memberInfos[0]);
}

function getAvatarForThread(
  thread: RawThreadInfo | ThreadInfo,
  containingThreadInfo: ?ThreadInfo,
): ClientAvatar {
  if (thread.avatar) {
    return thread.avatar;
  }

  if (containingThreadInfo && containingThreadInfo.id !== genesis().id) {
    return containingThreadInfo.avatar
      ? containingThreadInfo.avatar
      : getDefaultAvatar(containingThreadInfo.id, containingThreadInfo.color);
  }

  return getDefaultAvatar(thread.id, thread.color);
}

function useResolvedAvatar(
  avatarInfo: ClientAvatar,
  userInfo: ?GenericUserInfoWithAvatar,
): ResolvedClientAvatar {
  const ethAddress = React.useMemo(
    () => getETHAddressForUserInfo(userInfo),
    [userInfo],
  );

  const ensAvatarURI = useENSAvatar(ethAddress);

  const resolvedAvatar = React.useMemo(() => {
    if (avatarInfo.type !== 'ens') {
      return avatarInfo;
    }

    if (ensAvatarURI) {
      return {
        type: 'image',
        uri: ensAvatarURI,
      };
    }

    return defaultAnonymousUserEmojiAvatar;
  }, [ensAvatarURI, avatarInfo]);

  return resolvedAvatar;
}

export {
  defaultAnonymousUserEmojiAvatar,
  defaultEmojiAvatars,
  getRandomDefaultEmojiAvatar,
  getDefaultAvatar,
  getAvatarForUser,
  getUserAvatarForThread,
  getAvatarForThread,
  useResolvedAvatar,
};
