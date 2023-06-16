// @flow

import * as React from 'react';

import { useModalContext } from 'lib/components/modal-provider.react.js';
import SWMansionIcon from 'lib/components/SWMansionIcon.react.js';
import { inviteLinkUrl } from 'lib/facts/links.js';
import { threadInfoSelector } from 'lib/selectors/thread-selectors.js';
import type { InviteLink } from 'lib/types/link-types.js';
import { useResolvedThreadInfo } from 'lib/utils/entity-helpers.js';

import css from './view-invite-link-modal.css';
import Button from '../components/button.react.js';
import Modal from '../modals/modal.react.js';
import { useSelector } from '../redux/redux-utils.js';

type Props = {
  +inviteLink: InviteLink,
};

function ViewInviteLinkModal(props: Props): React.Node {
  const { inviteLink } = props;
  const threadInfo = useSelector(
    state => threadInfoSelector(state)[inviteLink.communityID],
  );
  const resolvedThreadInfo = useResolvedThreadInfo(threadInfo);
  const { popModal } = useModalContext();

  return (
    <Modal
      name={`Invite people to ${resolvedThreadInfo.uiName}`}
      onClose={popModal}
      size="fit-content"
    >
      <div className={css.container}>
        <div className={css.description}>
          Use this public link to invite your friends into the community!
        </div>
        <div className={css.sectionHeader}>Public link</div>
        <div className={css.linkContainer}>
          <div className={css.linkUrl}>{inviteLinkUrl(inviteLink.name)}</div>
          <Button className={css.linkCopyButton}>
            <SWMansionIcon icon="link" size={24} />
            Copy
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ViewInviteLinkModal;
