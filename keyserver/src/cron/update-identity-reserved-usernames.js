// @flow

import { getRustAPI } from 'rust-node-addon';

import type { ReservedUsernameMessage } from 'lib/types/crypto-types.js';

import { fetchAllUsernames } from '../fetchers/user-fetchers.js';
import { addReservedUsernamesStatement } from '../shared/message-statements.js';
import { fetchOlmAccount } from '../updaters/olm-account-updater.js';

async function updateIdentityReservedUsernames(): Promise<void> {
  const [usernames, rustAPI, accountInfo] = await Promise.all([
    fetchAllUsernames(),
    getRustAPI(),
    fetchOlmAccount('content'),
  ]);
  const issuedAt = new Date().toISOString();
  const reservedUsernameMessage: ReservedUsernameMessage<
    $ReadOnlyArray<string>,
  > = {
    statement: addReservedUsernamesStatement,
    payload: usernames,
    issuedAt,
  };
  const stringifiedMessage = JSON.stringify(reservedUsernameMessage);
  const signature = accountInfo.account.sign(stringifiedMessage);

  await rustAPI.addReservedUsernames(stringifiedMessage, signature);
}

export { updateIdentityReservedUsernames };
