// @flow

import {
  useConnectModal,
  RainbowKitProvider,
  darkTheme,
  useModalState,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import invariant from 'invariant';
import _merge from 'lodash/fp/merge.js';
import * as React from 'react';
import { useAccount, useWalletClient, WagmiConfig } from 'wagmi';

import ConnectedWalletInfo from 'lib/components/connected-wallet-info.react.js';
import type { SIWEWebViewMessage } from 'lib/types/siwe-types.js';
import {
  getSIWEStatementForPublicKey,
  siweMessageSigningExplanationStatements,
  createSIWEMessage,
} from 'lib/utils/siwe-utils.js';
import {
  AlchemyENSCacheProvider,
  wagmiConfig,
  wagmiChains,
} from 'lib/utils/wagmi-utils.js';

import { SIWEContext } from './siwe-context.js';
import css from './siwe.css';
import {
  useMonitorForWalletConnectModal,
  type WalletConnectModalUpdate,
} from './walletconnect-hooks.js';

function postMessageToNativeWebView(message: SIWEWebViewMessage) {
  window.ReactNativeWebView?.postMessage?.(JSON.stringify(message));
}

type Signer = {
  +signMessage: ({ +message: string, ... }) => Promise<string>,
  ...
};
async function signInWithEthereum(
  address: string,
  signer: Signer,
  nonce: string,
  statement: string,
) {
  invariant(nonce, 'nonce must be present in signInWithEthereum');
  const message = createSIWEMessage(address, statement, nonce);
  const signature = await signer.signMessage({ message });
  postMessageToNativeWebView({
    type: 'siwe_success',
    address,
    message,
    signature,
  });
}

function SIWE(): React.Node {
  const { address } = useAccount();
  const { data: signer } = useWalletClient();
  const { siweNonce, siwePrimaryIdentityPublicKey } =
    React.useContext(SIWEContext);
  const onClick = React.useCallback(() => {
    invariant(siweNonce, 'nonce must be present during SIWE attempt');
    invariant(
      siwePrimaryIdentityPublicKey,
      'primaryIdentityPublicKey must be present during SIWE attempt',
    );
    const statement = getSIWEStatementForPublicKey(
      siwePrimaryIdentityPublicKey,
    );
    signInWithEthereum(address, signer, siweNonce, statement);
  }, [address, signer, siweNonce, siwePrimaryIdentityPublicKey]);

  const { openConnectModal } = useConnectModal();
  const hasNonce = siweNonce !== null && siweNonce !== undefined;
  React.useEffect(() => {
    if (hasNonce && openConnectModal) {
      openConnectModal();
    }
  }, [hasNonce, openConnectModal]);

  const [wcModalOpen, setWCModalOpen] = React.useState(false);

  const prevConnectModalOpen = React.useRef(false);
  const modalState = useModalState();
  const closeTimeoutRef = React.useRef<?TimeoutID>();
  const { connectModalOpen } = modalState;
  React.useEffect(() => {
    if (
      !connectModalOpen &&
      !wcModalOpen &&
      prevConnectModalOpen.current &&
      !signer
    ) {
      closeTimeoutRef.current = setTimeout(
        () => postMessageToNativeWebView({ type: 'siwe_closed' }),
        250,
      );
    } else if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = undefined;
    }
    prevConnectModalOpen.current = connectModalOpen;
  }, [connectModalOpen, wcModalOpen, signer]);

  const onWalletConnectModalUpdate = React.useCallback(
    (update: WalletConnectModalUpdate) => {
      if (update.state === 'closed') {
        setWCModalOpen(false);
        postMessageToNativeWebView({
          type: 'walletconnect_modal_update',
          ...update,
        });
      } else {
        setWCModalOpen(true);
        postMessageToNativeWebView({
          type: 'walletconnect_modal_update',
          ...update,
        });
      }
    },
    [],
  );
  useMonitorForWalletConnectModal(onWalletConnectModalUpdate);

  if (!hasNonce) {
    return (
      <div className={css.wrapper}>
        <h1 className={css.h1}>Unable to proceed: nonce not found.</h1>
      </div>
    );
  } else if (!signer) {
    return null;
  } else {
    return (
      <div className={css.wrapper}>
        <span className={css.walletDisplayText}>
          <p>Wallet Connected</p>
        </span>
        <div className={css.connectedWalletInfo}>
          <ConnectedWalletInfo />
        </div>
        <p>{siweMessageSigningExplanationStatements}</p>
        <p>
          By signing up, you agree to our{' '}
          <a href="https://comm.app/terms">Terms of Use</a> &{' '}
          <a href="https://comm.app/privacy">Privacy Policy</a>.
        </p>
        <div className={css.button} onClick={onClick}>
          Sign in using this wallet
        </div>
      </div>
    );
  }
}

function SIWEWrapper(): React.Node {
  const theme = React.useMemo(() => {
    return _merge(darkTheme())({
      radii: {
        modal: 0,
        modalMobile: 0,
      },
      colors: {
        modalBackdrop: '#242529',
      },
    });
  }, []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <AlchemyENSCacheProvider>
        <RainbowKitProvider
          theme={theme}
          modalSize="compact"
          chains={wagmiChains}
        >
          <SIWE />
        </RainbowKitProvider>
      </AlchemyENSCacheProvider>
    </WagmiConfig>
  );
}

export default SIWEWrapper;
