// @flow

import * as React from 'react';

import {
  useDeleteAccount,
  deleteAccountActionTypes,
} from 'lib/actions/user-actions.js';
import { useModalContext } from 'lib/components/modal-provider.react.js';
import SWMansionIcon from 'lib/components/SWMansionIcon.react.js';
import { createLoadingStatusSelector } from 'lib/selectors/loading-selectors.js';
import { useDispatchActionPromise } from 'lib/utils/redux-promise-utils.js';

import css from './account-delete-modal.css';
import Button, { buttonThemes } from '../components/button.react.js';
import Modal from '../modals/modal.react.js';
import { useSelector } from '../redux/redux-utils.js';

const deleteAccountLoadingStatusSelector = createLoadingStatusSelector(
  deleteAccountActionTypes,
);

const AccountDeleteModal: React.ComponentType<{}> = React.memo<{}>(
  function AccountDeleteModal(): React.Node {
    const inputDisabled = useSelector(
      state => deleteAccountLoadingStatusSelector(state) === 'loading',
    );

    const callDeleteAccount = useDeleteAccount();
    const dispatchActionPromise = useDispatchActionPromise();
    const { popModal } = useModalContext();

    const [errorMessage, setErrorMessage] = React.useState('');
    let error;
    if (errorMessage) {
      error = (
        <div className={css.form_error}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    const deleteAccountAction = React.useCallback(async () => {
      try {
        setErrorMessage('');
        const response = await callDeleteAccount();
        popModal();
        return response;
      } catch (e) {
        setErrorMessage('unknown error deleting account');
        throw e;
      }
    }, [callDeleteAccount, popModal]);

    const onDelete = React.useCallback(
      (event: SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault();
        void dispatchActionPromise(
          deleteAccountActionTypes,
          deleteAccountAction(),
        );
      },
      [dispatchActionPromise, deleteAccountAction],
    );

    return (
      <Modal name="Delete Account" onClose={popModal} size="large">
        <div className={css.modal_body}>
          <form method="POST">
            <SWMansionIcon icon="warning-circle" size={22} />
            <p className={css.deletion_warning}>
              Your account will be permanently deleted. There is no way to
              reverse this.
            </p>
            <div className={css.form_footer}>
              <Button
                variant="filled"
                buttonColor={buttonThemes.danger}
                type="submit"
                onClick={onDelete}
                disabled={inputDisabled}
              >
                Delete Account
              </Button>
              {error}
            </div>
          </form>
        </div>
      </Modal>
    );
  },
);

export default AccountDeleteModal;
