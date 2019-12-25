import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, ScrollView, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Notifications } from 'expo';

import * as Permissions from 'expo-permissions';
import { HeaderBackButton } from 'react-navigation';

//chat
import { SENDBIRD_APP_ID } from '../settings';
import SendBird from 'sendbird';
import SendBirdDesk from 'sendbird-desk';

import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';

import colors from '../constants/Colors';
import i18n from '../constants/Strings';

import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_USER_ACCOUNT } from '../redux/constants';
import { setAccount, setUnreadCount } from '../redux/actions';

let UNIQUE_HANDLER_ID = '';
const BLOCKDOC_ICON = require('../assets/images/bdchat.png');
const USER_ICON = require('../assets/images/avatar.png');

class ChatScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      tabBarVisible: false,
      headerTitle: () => (<Text 
        style={{
          fontSize: 19,
          color: colors.headerFontColor,
          fontFamily: colors.headerFont,
          marginLeft: "auto", 
          marginRight: "auto",
          textAlign: 'center',
          alignSelf: 'center',
        }}>
          {i18n.t('chat_head')}
        </Text>
      ),
      headerRight: (<View></View>),
    }
  };

  constructor (props) {

    super(props);

    this.state = {
      messages: [],
      isTyping: false,
      isMounted: false,
    };

  }
  
  channel = null;

  sb = SendBird.getInstance();

  componentDidMount () {

    const account = this.props.user.account;

    if (__DEV__) console.log('Chat account channel:',account.channel)

    this.setState({
      isMounted: true,
    }, () => {
      if ( account.channel ) {
        this.sb.GroupChannel.getChannel(account.channel, (joinedChannel, error) => {
          
          if (error && __DEV__) {
            console.error(error);
          } else {
            const messagesQuery = joinedChannel.createPreviousMessageListQuery();
            this.channel = joinedChannel;

            messagesQuery.load(50, true, (messages, error) => {
              if (error && __DEV__) console.error(error)
              if (this.state.isMounted) {
                this.setMessages(messages);
                this.setupHandler();
              }
            }); // ends messages load

          }; // ends else

        }); // ends this.sb.GroupChannel

      } else { //Need to create channel

        if (__DEV__) console.log('Chat: Need to create ticket channel')

        SendBirdDesk.init(SendBird);

        SendBirdDesk.authenticate(account.id, (res, err) => {
          if(err) throw err;
      
          SendBirdDesk.Ticket.create(account.id, account.nickname, (ticket, err) => {
            if(err) throw err;

            SecureStore.getItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(result => {
            
              const account = result ? JSON.parse(result) : {};
              
              updatedAccount = {...account, channel: ticket.channelUrl };
              SecureStore.setItemAsync(SECURE_STORAGE_USER_ACCOUNT, JSON.stringify(updatedAccount));

              if (this.state.isMounted) {
                this.props.dispatch(setAccount(updatedAccount));
                this.channel = ticket.channel;
                this.setupHandler();
              }
            }); //ends secure storage

          }); //ends ticket create

        }); //ends authenticate
    
      } //ends if/else
    });

  } //end did mount

  componentWillUnmount() {

    this.state.isMounted = false;

    if (UNIQUE_HANDLER_ID) {
      this.sb.removeChannelHandler(UNIQUE_HANDLER_ID);
    }

  }

  handleSend = (messages = []) => {
    if (this.channel && this.state.isMounted) {
      this.setState((previousState) => {
        this.channel.sendUserMessage(messages[0].text, (response, error) => {
          if (error && __DEV__) console.log(error)
        });
        return { messages: GiftedChat.append(previousState.messages, messages) };
      });
    }

  }; //ends handleSend

  setMessages = async (messages) => {

    const { account, notificationCount } = this.props.user;

    this.channel.markAsRead();

    this.props.dispatch(setUnreadCount(0));

    if (this.state.isMounted) {
      this.setState({
        messages: messages.map(m => ({
          timestamp: m.createdAt,
          text: m.message,
          user: {
            _id: m._sender && m._sender.userId,
            avatar: (m._sender && m._sender.userId === account.id) ? USER_ICON : BLOCKDOC_ICON,
            name: m._sender && m._sender.nickname,
          },
          _id: m.messageId,
        }))
      }); //ends setstate
    }
    
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status === 'granted') {
      if ( Platform.OS === 'ios' ) {
        Notifications.setBadgeNumberAsync(notificationCount || 0);
      }
      else if ( Platform.OS === 'android' ) {
        //?????????????????????????????????
      }
    }

  }; // ends setMessages

  setupHandler = () => {

    let ChannelHandler = new this.sb.ChannelHandler();

    ChannelHandler.onMessageReceived = (channel, m) => {
      if (channel.url === this.channel.url) {
        this.channel.markAsRead();
        this.props.dispatch(setUnreadCount(0));
        
        if (this.state.isMounted) {
          this.setState((previousState) => {
            return { messages: GiftedChat.append(previousState.messages, [{
              timestamp: m.createdAt,
              text: m.message,
              user: {
                _id: m._sender && m._sender.userId,
                avatar: BLOCKDOC_ICON,
                name: m._sender && m._sender.nickname,
              },
              _id: m.messageId,
            }]) };
          });
        }
      };
    };

    ChannelHandler.onTypingStatusUpdated = (channel) => {
      if (channel.url === this.channel.url && this.state.isMounted) {
        this.setState({
          isTyping: channel.getTypingMembers().length > 0,
        })
      }
    };

    UNIQUE_HANDLER_ID = 'BLOCKDOC_CHANNEL_HANDLER';
    this.sb.addChannelHandler(UNIQUE_HANDLER_ID, ChannelHandler);

  }; //end setupHandler

  renderFooter = () => {
    if (this.state.isTyping) {
      return <View style={{marginLeft: 10, marginBottom: 9}}>
        <Text style={{color: colors.gray}}>{i18n.t('chat_agent_typing')}</Text>
      </View>
    }
    return null;
  }
  
  SendButton(props) {
    return (
      <Send
        {...props}
      >
        <View style={{marginRight: 15, marginBottom: 15}}>
          <Text style={{
            color: '#1565C0', //need to make sure this color is what we want/use
            fontSize: 16, 
            fontFamily: colors.headerFont
          }}>{i18n.t('chat_send')}</Text>
        </View>
      </Send>
    );
  }

  NoSendButton(props) {
    return (
      <Send
        {...props}
      >
        <View style={{marginRight: 15, marginBottom: 15}}>
          <Text style={{color: '#1565C0', fontSize: 16, fontWeight: 'bold'}}></Text>
        </View>
      </Send>
    );
  }

  render() {

    const { account } = this.props.user;
    
    const user = {
      _id: account.id,
      name: account.nickname,
      avatar: USER_ICON,
    };
    
    const orderedMessages = this.state.messages.sort((a, b) => {
      if (a.timestamp < b.timestamp) return 1;
      if (a.timestamp > b.timestamp) return -1;
      return 0;
    });

    let internet = this.props.user.internet.internet_connected;

    if (!internet){
      Alert.alert(
        i18n.t('home_internet_title'),
        i18n.t('global_internet_text_half')+ i18n.t('chat_sendmsg'),
        [
          {text: i18n.t('global_ok'), onPress: () => { if (__DEV__) console.log('OK Pressed') } } ,
        ],
        {cancelable: false},
      );
    }
    
    return (

<View style={styles.container}>

<GiftedChat
  messages={orderedMessages.length ? orderedMessages : [{
    _id: 'initial_text',
    text: '',
    user: {
      _id: 'admin',
    },
  }]}
  onSend={this.handleSend}
  user={user}
  renderSend={internet ? this.SendButton : this.NoSendButton}
  bottomOffset={0}
  showUserAvatar={true}
  renderAvatarOnTop={true}
  alwaysShowSend={true}
  placeholder={i18n.t('chat_ask_us')}
  renderChatFooter={this.renderFooter}
  keyboardShouldPersistTaps="handled"
  renderBubble={props => {
    return (<Bubble 
      {...props} 
      textStyle={{
        left: {color: colors.darkGray},
        right: {color: colors.darkGray},
      }}
      wrapperStyle={{
        left: {
          backgroundColor: colors.lightYellow,
          paddingTop: 5,
          paddingBottom: 5,
        },
        right: {
          backgroundColor: colors.lighterGray,
          paddingTop: 5,
          paddingBottom: 5,
        },
      }}
    />);
  }}
/>

{/* 
  GiftedChat already avoids the keyboard in 
  iOS but that's somehow broken in Android so need
  in Android
*/}

{ Platform.OS === 'android' && 
  <KeyboardAvoidingView 
    behavior="padding" 
    keyboardVerticalOffset={100} 
  /> 
}

</View>);}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF'
  },
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(ChatScreen);