import React from 'react';
import { GroupInfo } from '@redux/types/group';
import { PortalAdd, PortalRemove } from '@web/utils/portal';
import { useCallback } from 'react';
import { FullModal } from '@web/components/FullModal';
import { GroupInfoDetail } from './GroupInfoDetail';
import { showToasts } from '@shared/manager/ui';
import _isNil from 'lodash/isNil';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { useCurrentUserUUID } from '@redux/hooks/user';
import { showAlert } from '@redux/actions/ui';
import { dismissGroup, quitGroup } from '@redux/actions/group';
import { GroupPanelCreate } from '@web/components/modal/GroupPanelCreate';
import { openModal, ModalWrapper } from '@web/components/Modal';

export function useGroupHeaderAction(groupInfo: GroupInfo) {
  const dispatch = useTRPGDispatch();
  const currentUserUUID = useCurrentUserUUID();
  const groupUUID = groupInfo.uuid;

  const handleShowGroupInfo = useCallback(() => {
    const key = PortalAdd(
      <FullModal visible={true} onChangeVisible={() => PortalRemove(key)}>
        <GroupInfoDetail groupUUID={groupUUID} />
      </FullModal>
    );
  }, [groupUUID]);

  // 创建面板
  const handleCreateGroupPanel = useCallback(() => {
    openModal(
      <ModalWrapper>
        <GroupPanelCreate groupUUID={groupUUID} />
      </ModalWrapper>
    );
  }, [groupUUID]);

  // 解散/退出团
  const handleQuitGroup = useCallback(() => {
    if (_isNil(groupInfo)) {
      showToasts('找不到该团');
      return;
    }

    const groupUUID = groupInfo.uuid;
    if (currentUserUUID === groupInfo.owner_uuid) {
      // 解散团
      dispatch(
        showAlert({
          title: '是否要解散群',
          content: '一旦确定无法撤销',
          onConfirm: () => {
            dispatch(dismissGroup(groupUUID));
          },
        })
      );
    } else {
      dispatch(
        showAlert({
          title: '是否要退出群',
          content: '一旦确定无法撤销',
          onConfirm: () => {
            dispatch(quitGroup(groupUUID));
          },
        })
      );
    }
  }, [currentUserUUID, groupInfo?.owner_uuid, groupInfo?.uuid]);

  return { handleShowGroupInfo, handleCreateGroupPanel, handleQuitGroup };
}
