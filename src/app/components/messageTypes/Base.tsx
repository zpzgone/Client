import React from 'react';
import { View, Text } from 'react-native';
import sb from 'react-native-style-block';
import { TAvatar } from '../TComponent';
import dateHelper from '../../../shared/utils/date-helper';
import config from '../../../../config/project.config';

export interface BaseMessageProps {
  type: string;
  me: boolean;
  name: string;
  avatar: string;
  emphasizeTime: boolean;
  info: any;
}
class Base<
  P extends BaseMessageProps = BaseMessageProps
> extends React.Component<P> {
  static defaultProps = {
    type: 'normal',
    me: false,
    name: '',
    info: {},
    emphasizeTime: false,
  };

  /**
   * 是否应用消息内边距
   */
  get isMsgPadding() {
    return true;
  }

  getContent() {
    return null;
  }

  render() {
    const { type, me, name, avatar, info, emphasizeTime } = this.props;
    let defaultAvatar =
      info.sender_uuid === 'trpgsystem'
        ? config.defaultImg.trpgsystem
        : config.defaultImg.getUser(name);

    return (
      <View>
        {emphasizeTime ? (
          <Text style={styles.itemTime}>
            {dateHelper.getShortDate(info.date)}
          </Text>
        ) : null}
        <View
          style={[
            ...styles.itemView,
            me ? { flexDirection: 'row-reverse' } : null,
          ]}
        >
          <TAvatar
            style={styles.itemAvatar}
            uri={avatar}
            name={name}
            height={40}
            width={40}
          />
          <View style={styles.itemBody}>
            <Text
              style={[...styles.itemName, me ? { textAlign: 'right' } : null]}
            >
              {name}
            </Text>
            <View
              style={[
                ...styles.itemMsg,
                me ? { alignSelf: 'flex-end' } : null,
                !this.isMsgPadding ? sb.padding(0) : null,
              ]}
            >
              {this.getContent()}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  itemTime: [
    sb.margin(10, 'auto', 0),
    sb.color('rgba(0, 0, 0, 0.2)'),
    sb.padding(4, 10),
    sb.font(10, 14),
  ],
  itemView: [sb.direction(), sb.padding(10, 10)],
  itemAvatar: [sb.radius(20)],
  itemBody: [sb.padding(0, 4), sb.margin(0, 6), sb.flex()],
  itemName: [{ marginBottom: 4, marginTop: 4 }, sb.font(12)],
  itemMsg: [
    sb.bgColor(),
    sb.padding(6, 8),
    sb.flex(0),
    sb.radius(3),
    sb.border('all', 0.5, '#ddd'),
    sb.alignSelf('flex-start'),
  ],
};

export default Base;