// @flow

import olm from '@commapp/olm';
import _memoize from 'lodash/memoize.js';
import { createSelector } from 'reselect';

import {
  sessionIDSelector,
  urlPrefixSelector,
  cookieSelector,
} from 'lib/selectors/keyserver-selectors.js';
import {
  getClientResponsesSelector,
  sessionStateFuncSelector,
} from 'lib/selectors/socket-selectors.js';
import { createOpenSocketFunction } from 'lib/shared/socket-utils.js';
import type {
  SignedIdentityKeysBlob,
  IdentityKeysBlob,
  CryptoStore,
} from 'lib/types/crypto-types.js';
import type {
  ClientServerRequest,
  ClientClientResponse,
} from 'lib/types/request-types.js';
import type {
  SessionIdentification,
  SessionState,
} from 'lib/types/session-types.js';
import type { OneTimeKeyGenerator } from 'lib/types/socket-types.js';

import { initOlm } from '../olm/olm-utils.js';
import type { AppState } from '../redux/redux-setup.js';

const baseOpenSocketSelector: (
  keyserverID: string,
) => (state: AppState) => ?() => WebSocket = keyserverID =>
  createSelector(urlPrefixSelector(keyserverID), (urlPrefix: ?string) => {
    if (!urlPrefix) {
      return null;
    }
    return createOpenSocketFunction(urlPrefix);
  });

const openSocketSelector: (
  keyserverID: string,
) => (state: AppState) => ?() => WebSocket = _memoize(baseOpenSocketSelector);

const baseSessionIdentificationSelector: (
  keyserverID: string,
) => (state: AppState) => SessionIdentification = keyserverID =>
  createSelector(
    cookieSelector(keyserverID),
    sessionIDSelector(keyserverID),
    (cookie: ?string, sessionID: ?string): SessionIdentification => ({
      cookie,
      sessionID,
    }),
  );

const sessionIdentificationSelector: (
  keyserverID: string,
) => (state: AppState) => SessionIdentification = _memoize(
  baseSessionIdentificationSelector,
);

const getSignedIdentityKeysBlobSelector: (
  state: AppState,
) => ?() => Promise<SignedIdentityKeysBlob> = createSelector(
  (state: AppState) => state.cryptoStore,
  (cryptoStore: ?CryptoStore) => {
    if (!cryptoStore) {
      return null;
    }

    return async () => {
      await initOlm();
      const { primaryAccount, primaryIdentityKeys, notificationIdentityKeys } =
        cryptoStore;
      const primaryOLMAccount = new olm.Account();
      primaryOLMAccount.unpickle(
        primaryAccount.picklingKey,
        primaryAccount.pickledAccount,
      );

      const identityKeysBlob: IdentityKeysBlob = {
        primaryIdentityPublicKeys: primaryIdentityKeys,
        notificationIdentityPublicKeys: notificationIdentityKeys,
      };

      const payloadToBeSigned: string = JSON.stringify(identityKeysBlob);
      const signedIdentityKeysBlob: SignedIdentityKeysBlob = {
        payload: payloadToBeSigned,
        signature: primaryOLMAccount.sign(payloadToBeSigned),
      };

      return signedIdentityKeysBlob;
    };
  },
);

const webGetClientResponsesSelector: (
  state: AppState,
) => (
  serverRequests: $ReadOnlyArray<ClientServerRequest>,
) => Promise<$ReadOnlyArray<ClientClientResponse>> = createSelector(
  getClientResponsesSelector,
  getSignedIdentityKeysBlobSelector,
  (state: AppState) => state.navInfo.tab === 'calendar',
  (
      getClientResponsesFunc: (
        calendarActive: boolean,
        oneTimeKeyGenerator: ?OneTimeKeyGenerator,
        getSignedIdentityKeysBlob: ?() => Promise<SignedIdentityKeysBlob>,
        getInitialNotificationsEncryptedMessage: ?() => Promise<string>,
        serverRequests: $ReadOnlyArray<ClientServerRequest>,
      ) => Promise<$ReadOnlyArray<ClientClientResponse>>,
      getSignedIdentityKeysBlob: ?() => Promise<SignedIdentityKeysBlob>,
      calendarActive: boolean,
    ) =>
    (serverRequests: $ReadOnlyArray<ClientServerRequest>) =>
      getClientResponsesFunc(
        calendarActive,
        null,
        getSignedIdentityKeysBlob,
        null,
        serverRequests,
      ),
);

const baseWebSessionStateFuncSelector: (
  keyserverID: string,
) => (state: AppState) => () => SessionState = keyserverID =>
  createSelector(
    sessionStateFuncSelector(keyserverID),
    (state: AppState) => state.navInfo.tab === 'calendar',
    (
        sessionStateFunc: (calendarActive: boolean) => SessionState,
        calendarActive: boolean,
      ) =>
      () =>
        sessionStateFunc(calendarActive),
  );

const webSessionStateFuncSelector: (
  keyserverID: string,
) => (state: AppState) => () => SessionState = _memoize(
  baseWebSessionStateFuncSelector,
);

export {
  openSocketSelector,
  sessionIdentificationSelector,
  getSignedIdentityKeysBlobSelector,
  webGetClientResponsesSelector,
  webSessionStateFuncSelector,
};
