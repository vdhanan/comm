// @flow

import { useConnectModal } from '@rainbow-me/rainbowkit';
import * as React from 'react';
import { useSigner } from 'wagmi';

import { isDev } from 'lib/utils/dev-utils';

import css from './log-in-form.css';
import SIWEButton from './siwe-button.react.js';
import SIWE from './siwe.react.js';
import TraditionalLoginForm from './traditional-login-form.react.js';

function LoginForm(): React.Node {
  const { openConnectModal } = useConnectModal();
  const { data: signer } = useSigner();

  const [
    siweAuthFlowSelected,
    setSIWEAuthFlowSelected,
  ] = React.useState<boolean>(false);

  const onSIWEButtonClick = React.useCallback(() => {
    setSIWEAuthFlowSelected(true);
    openConnectModal && openConnectModal();
  }, [openConnectModal]);

  let siweSection;
  if (isDev && siweAuthFlowSelected && signer) {
    siweSection = <SIWE />;
  } else if (isDev) {
    siweSection = <SIWEButton onSIWEButtonClick={onSIWEButtonClick} />;
  }

  return (
    <div className={css.modal_body}>
      <TraditionalLoginForm />
      {siweSection ? <hr /> : null}
      {siweSection}
    </div>
  );
}

export default LoginForm;
