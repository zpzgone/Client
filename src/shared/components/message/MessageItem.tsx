import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import MessageHandler from './MessageHandler';
import { useCurrentUserInfo } from '@redux/hooks/user';
import { useCachedUserInfo } from '@shared/hooks/useCache';
import { MsgPayload } from '@redux/types/chat';
import { getUserName } from '@shared/utils/data-helper';

interface Props {
  data: MsgPayload;
  emphasizeTime: boolean;
}
export const MessageItem: React.FC<Props> = TMemo((props) => {
  const { data, emphasizeTime } = props;
  const selfInfo = useCurrentUserInfo();
  const senderUUID = data.sender_uuid;
  const isMe = selfInfo.uuid === senderUUID;
  const senderInfo = useCachedUserInfo(senderUUID);
  const name = getUserName(senderInfo);
  const avatar = senderInfo.avatar;

  return (
    <MessageHandler
      type={data.type}
      me={isMe}
      name={name}
      avatar={avatar ?? ''}
      emphasizeTime={emphasizeTime}
      info={data}
    />
  );
});
MessageItem.displayName = 'MessageItem';
