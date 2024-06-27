// @flow

import * as React from 'react';

import SWMansionIcon from 'lib/components/swmansion-icon.react.js';
import { useRelationshipCallbacks } from 'lib/hooks/relationship-prompt.js';

import css from './user-list-row.css';
import type { UserRowProps } from './user-list.react.js';
import UserAvatar from '../../avatars/user-avatar.react.js';
import MenuItem from '../../components/menu-item.react.js';
import Menu from '../../components/menu.react.js';
import { usePushUserProfileModal } from '../../modals/user-profile/user-profile-utils.js';

function BlockListRow(props: UserRowProps): React.Node {
  const { userInfo, onMenuVisibilityChange } = props;
  const {
    callbacks: { unblockUser },
  } = useRelationshipCallbacks(userInfo.id);
  const editIcon = <SWMansionIcon icon="edit-1" size={22} />;

  const pushUserProfileModal = usePushUserProfileModal(userInfo.id);

  return (
    <div className={css.container} onClick={pushUserProfileModal}>
      <div className={css.userInfoContainer}>
        <UserAvatar size="S" userID={userInfo.id} />
        <div className={css.usernameContainer}>{userInfo.username}</div>
      </div>
      <div className={css.buttons}>
        <div className={css.edit_menu}>
          <Menu
            onChange={onMenuVisibilityChange}
            icon={editIcon}
            variant="member-actions"
          >
            <MenuItem text="Unblock" icon="user-plus" onClick={unblockUser} />
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default BlockListRow;
