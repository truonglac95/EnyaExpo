import React from 'react';
import { connect } from 'react-redux';
import { Platform, StatusBar, View } from 'react-native';

import NetInfo from "@react-native-community/netinfo";
import {useNetInfo} from "@react-native-community/netinfo";

import Stargazer from "react-native-stargazer";
import { Notifications } from 'expo';

import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

import SendBird from 'sendbird';

import AppNavigator from './navigation/AppNavigator';

import LoginScreen from './screens/LoginScreen';
import CodeScannerScreen from './screens/CodeScannerScreen';
import AccountDeletedScreen from './screens/AccountDeletedScreen';
import AccountDeleteScreen from './screens/AccountDeleteScreen';

import ResultDNAShareScreen from './screens/ResultDNAShareScreen';
import ResultPreportScreen from './screens/ResultPreportScreen';

import TermsAndConditionsScreen_en from './screens/TermsAndConditionsScreen_en';
import TermsAndConditionsScreen_zh from './screens/TermsAndConditionsScreen_zh';

import stargazerRoutes from "./StargazerRouteConfig";
import appRoutes from "./AppRoutes";

import {
  SENDBIRD_APP_ID,
  MY_IP_ADDRESS,
  TEST_MODE,
  SECURE_PRS_CHANNEL_3,
} from './settings';

//redux
import { 
  setAccount,
  getResults,
  getStatus, /*check whitelist table in DB*/
  circulateStatus, /*circulate stored value of the status variable*/
  resetError,
  receiveNotification,
  setUnreadCount,
  internetStatus,
  sbConnected,
} from './redux/actions';

import * as SecureStore from 'expo-secure-store';

import { 
  SECURE_STORAGE_USER_ACCOUNT,
  SECURE_STORAGE_USER_RESULT,
  SECURE_STORAGE_USER_STATUS,
} from './redux/constants';

const pdfStore = `${FileSystem.documentDirectory}User/PDFs`;

let UNIQUE_HANDLER_ID = '';

const sb = new SendBird({ appId : SENDBIRD_APP_ID });
const STARGAZER_SERVER_URL = `http://${MY_IP_ADDRESS}:9000/screenshot`;

// Subscribe
/*
const unsubscribeNetInfo = NetInfo.addEventListener(state => {
  console.log("NetInfo:Connection type:", state.type);
  console.log("NetInfo:Is connected?", state.isConnected);
});
*/

const ServerTest = async input_json => {
  try { key =  await fetch(SECURE_PRS_CHANNEL_3 + 'uuid-whitelist', 
        {
          method:'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input_json)
        }
      )
    return { status:key.status }
  }
  catch ( error ) { 
    return error 
  }
}

class MainApp extends React.Component {

  sbInstance = null;

  constructor (props) {
    super (props);
  }

  async componentDidMount() {

    const { dispatch } = this.props;

    dispatch(resetError());
    
    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
      });
    }

    NetInfo.fetch().then(state => {
      if (__DEV__) console.log('Initial state is ' + (state.isConnected ? 'online' : 'offline'));
      if (state.isConnected) {
        ServerTest({uuid:'ServerConnectTest'}).then((server) => {
          if (__DEV__) console.log('Server connection info: ' + (server.status == 201 ? 'connected' : 'error'))
          this.props.dispatch(internetStatus({
            internet_connected: true,
            servers_reachable: server.status == 201,
          }));
        })
      } else {
        this.props.dispatch(internetStatus({
          internet_connected: false,
          servers_reachable: false,
        }));
      }
    });

    NetInfo.addEventListener(this._handleConnectivityChange);

    Notifications.addListener(this._handleNotification);

  }

  UNSAFE_componentWillMount() {

    //if (__DEV__) {
    //  console.log('We are in DEV mode')
    //} else {
    //  console.log('We are in PRODUCTION mode')
    //}

    FileSystem.getInfoAsync(pdfStore).then(({ exists }) => {
      if( !exists ) {
        FileSystem.makeDirectoryAsync(
          pdfStore, { intermediates: true }
        ).catch(err => {
          if (__DEV__) console.log(err);
        });
      }
    });

    //load account settings, if any
    SecureStore.getItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(result => {
      if (result) {
        const account = result ? JSON.parse(result) : {};
        if (__DEV__) console.log('MainApp: Previous account settings found.');
        //console.log(account);
        let updatedAccount = {
          ...account,
          loading: false,
        };
        this.props.dispatch(setAccount(updatedAccount));
      } else {
        //need to set up account
        if (__DEV__) console.log('MainApp: No account settings found - set up new account.');
        this.props.dispatch(setAccount({loading: false}));
        //this now triggers flow through QR, T&C, and password
        //ultimate successfull login will trigger 
        //results download
      }
    }).catch(err => {
      if (__DEV__) console.log(err);
    });

    //load status settings, if any
    SecureStore.getItemAsync(SECURE_STORAGE_USER_STATUS).then(result => {
      if (result) {
        const status = result ? JSON.parse(result) : {};
        //console.log('MainApp: Previous status settings found:');
        //console.log(status);
        //console.log('MainApp: Circulating status');
        this.props.dispatch(circulateStatus(status));
      } else {
        //need to set up status
        if (__DEV__) console.log('MainApp: No status settings found - need to set up.');
        //console.log(this.props.user.account.UUID);
        if(!this.props.user.account.UUID) {
          //too early to do anything
          //need to wait until login
        } else {
          if (__DEV__) console.log('MainApp: Getting value of status variable');
          this.props.dispatch(getStatus(this.props.user.account.UUID));
          //this will also save a local copy, and circulate the status variable
        }
      }
    }).catch(err => {
      if (__DEV__) console.log(err);
    });

  }

  componentWillUnmount() {

    NetInfo.removeEventListener(this._handleConnectivityChange);

    if (UNIQUE_HANDLER_ID) {
      this.sbInstance.removeChannelHandler(UNIQUE_HANDLER_ID);
    }
  }

  setupSendBird = async (user) => {

    const { dispatch } = this.props;
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    
    if (__DEV__) console.log('--- setting up sendbird ---')

    this.sbInstance = SendBird.getInstance();
    let ChannelHandler = new this.sbInstance.ChannelHandler();
    let badgeNumber = 0;

    if (UNIQUE_HANDLER_ID) {
      this.sbInstance.removeChannelHandler(UNIQUE_HANDLER_ID);
    }

    ChannelHandler.onMessageReceived = (channel) => { 
      if (user.account.channel === channel.url) {
        dispatch(setUnreadCount(channel.unreadMessageCount));

        if (status === 'granted') {
          badgeNumber = (user.notificationCount || 0) + channel.unreadMessageCount;
          if ( Platform.OS === 'ios' ) {
            Notifications.setBadgeNumberAsync( badgeNumber || 0 );
          } else if ( Platform.OS === 'android' ) {
            //????????????????????????????????
          }
        }
      }
    };

    this.sbInstance.GroupChannel.getChannel(user.account.channel, (joinedChannel, error) => {
      if (error) {
        console.error(error);
      } else {
        dispatch(setUnreadCount(joinedChannel.unreadMessageCount));

        if (status === 'granted') {
          badgeNumber = (user.notificationCount || 0) + joinedChannel.unreadMessageCount;
          if ( Platform.OS === 'ios' ) {
            Notifications.setBadgeNumberAsync( badgeNumber || 0 );
          }
          else if ( Platform.OS === 'android' ) {
            //????????????????????????????????
          }
        }

      } // ends else

    }); // ends this.sbInstance.GroupChannel

    UNIQUE_HANDLER_ID = 'HOME_BLOCKDOC_CHANNEL_HANDLER';
    this.sbInstance.addChannelHandler(UNIQUE_HANDLER_ID, ChannelHandler);
  }

  async UNSAFE_componentWillReceiveProps( nextProps ) {

    //console.log('componentWillReceiveProps( nextProps )')
    //console.log(nextProps)

    const { dispatch, user } = nextProps;
    const { user: prevUser } = this.props;

    if ( !user.sbConnected && user.internet.internet_connected && user.account.id ) {
      if (!prevUser.internet.internet_connected || !prevUser.account.id ) {
      
      sb.connect(user.account.id, (res, error) => {
        if (error) {
          if (__DEV__) console.log('Sendbird error 1:')
          if (__DEV__) console.log(error);
        } else {
          sb.updateCurrentUserInfo(user.account.nickname, null, (res, error) => {
            if (error) {
              if (__DEV__) console.log('Sendbird error 2:');
              if (__DEV__) console.log(error);
            }
            dispatch(sbConnected());
          });
          if (user.account.channel) {
            this.setupSendBird(user);
          }
        }
      });
    }
  }

    if (prevUser.account.id &&
       !prevUser.account.channel && 
        user.account.channel && 
        user.internet.internet_connected) {
      this.setupSendBird(user);
    }

  }

  _handleConnectivityChange = (netInfoState /*internet_connected*/) => {

      if (netInfoState.isConnected) {
        ServerTest({uuid:'ServerConnectTest'}).then((server) => {
          if (__DEV__) console.log('Server connection info: ' + (server.status == 201 ? 'connected' : 'error'))
          this.props.dispatch(internetStatus({
            internet_connected: true,
            servers_reachable: server.status == 201,
          }));
        })
      } else {
        this.props.dispatch(internetStatus({
          internet_connected: false,
          servers_reachable: false,
        }));
      }

      if (__DEV__) console.log(`Connected to internet? ${netInfoState.isConnected}`);

  }

  _handleNotification = async (notification) => {
    
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    
    const { dispatch, user } = this.props;

    //deal with badge numbers
    //for example, if a notification just came in, it will say 1
    //this is needed to set the badge number in the App icon
 
    let badgeNumber = 0;

    if (status === 'granted' && notification && notification.data) {
      if ( Platform.OS === 'ios' ) {
        badgeNumber = await Notifications.getBadgeNumberAsync();
        if (__DEV__) console.log('Current badge number:', badgeNumber)
        badgeNumber = badgeNumber || 0;
      }
      else if ( Platform.OS === 'android' ) {
        //????????????????????????????????
      }
      if (__DEV__) console.log('Received some sort of notification:', notification.data)
      switch (notification.data.type) {
        case 'HAVE_NEW_FILE':
          if (__DEV__) console.log('Received notification:', notification.data.type)
          badgeNumber = badgeNumber + 1;
          break;
        case 'HAVE_NEW_STATUS':
          if (__DEV__) console.log('Received notification:', notification.data.type)
          badgeNumber = badgeNumber + 1;
          break;
      }

      dispatch(receiveNotification((user.notificationCount || 0) + 1));

      if ( Platform.OS === 'ios' ) {
        Notifications.setBadgeNumberAsync( badgeNumber || 0 );
      }
      else if ( Platform.OS === 'android' ) {
        //????????????????????????????????
      }

    }
    
    //Yes - there is a new result of some sort - let's connect to our servers to check!
    //the badge will be reset once the user clicks 'Check Status or View Result'
    if (notification && notification.data) {
      if (__DEV__) console.log('firing getResults based on notification')
      switch (notification.data.type) {
        //at this point, we check in with the database and update lots of stuff
        case 'HAVE_NEW_FILE':
          dispatch(getResults(user.account.UUID));
          break;
        case 'HAVE_NEW_STATUS':
          dispatch(getResults(user.account.UUID));
          break;
        default:
      }
    }
  };

  
  render() {

    //console.log(this.props.user.sbConnected)
    
    if (TEST_MODE) {
      return <Stargazer
        routeConfig={stargazerRoutes}
        appRouteConfig={appRoutes}
        stargazerServerUrl={STARGAZER_SERVER_URL}
      />
    }

    const { account, loginToken } = this.props.user;

    //const { status } = this.props.whitelist;
    //console.log('Mainapp props')
    //console.log(this.props.whitelist)
    //console.log('WhiteList status:')
    //console.log(status)

    //for easy screen ui testing just enter them right here
    //return <ResultDNAShareScreen/>;
    //return <TermsAndConditionsScreen_en/>;

    if ( this.props.user.deleted ) {
      return <AccountDeletedScreen onWipeOut={this.props.onWipeOut}/>
    }

    if ( typeof(account.loading) == 'undefined' ) {
      //waiting to hear back from secure storage asyc call
      return null;
    }
    else if ( !account.UUID ) {
      if (__DEV__) console.log('Need to set up new account - first, scan the QR code')
      return <CodeScannerScreen onScanSuccess={this.handleScanSuccess} />
    }
    else if ( (!loginToken || !loginToken.valid) && !account.password ) {
      //console.log('Signup screen')
      return <LoginScreen login = {false}/>
    }
    else if ( !loginToken || !loginToken.valid ) {
      if (__DEV__) console.log('Going to login screen')
      return <LoginScreen login = {true}/>
    }
    else {
      //all set - grant access
      return (
        <View style={{flex: 1}}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }

  }
}

const mapStateToProps = state => ({
  user: state.user,
  result: state.result,
  whitelist: state.whitelist,
});

export default connect(mapStateToProps)(MainApp);