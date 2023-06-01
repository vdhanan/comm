// @flow

import type {
  UpdateUserAvatarRequest,
  ClientAvatar,
} from 'lib/types/avatar-types.js';
import type { NativeMediaSelection } from 'lib/types/media-types.js';
import type { SIWEResult } from 'lib/types/siwe-types.js';

export type CoolOrNerdMode = 'cool' | 'nerd';

export type EthereumAccountSelection = {
  +accountType: 'ethereum',
  ...SIWEResult,
  +avatarURI: ?string,
};

export type UsernameAccountSelection = {
  +accountType: 'username',
  +username: string,
  +password: string,
};

export type AccountSelection =
  | EthereumAccountSelection
  | UsernameAccountSelection;

export type AvatarData =
  | {
      +needsUpload: true,
      +mediaSelection: NativeMediaSelection,
      +clientAvatar: ClientAvatar,
    }
  | {
      +needsUpload: false,
      +updateUserAvatarRequest: UpdateUserAvatarRequest,
      +clientAvatar: ClientAvatar,
    };
