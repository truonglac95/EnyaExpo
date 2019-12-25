import React from 'react';
import { connect } from 'react-redux';
import { Platform, StatusBar, View } from 'react-native';

import { Notifications } from 'expo';

import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

import AppNavigator from './navigation/AppNavigator';

import LoginScreen from './screens/LoginScreen';
import CodeScannerScreen from './screens/CodeScannerScreen';
import AccountDeletedScreen from './screens/AccountDeletedScreen';
import AccountDeleteScreen from './screens/AccountDeleteScreen';

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
} from './redux/actions';

import * as SecureStore from 'expo-secure-store';

import { 
  SECURE_STORAGE_USER_ACCOUNT,
  SECURE_STORAGE_USER_RESULT,
  SECURE_STORAGE_USER_STATUS,
} from './redux/constants';

const pdfStore = `${FileSystem.documentDirectory}User/PDFs`;

const SMC_ServerTest = async input_json => {
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

/*
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
*/

class MainApp extends React.Component {

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
        //
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
        //
      }

    }
    
    //Yes - there is a new result of some sort - let's connect to our servers to check!
    //The badge will be reset once the user clicks 'Check Status or View Result'
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

    const { account, loginToken } = this.props.user;

    if ( this.props.user.deleted ) {
      return <AccountDeletedScreen onWipeOut={this.props.onWipeOut}/>
    }
    else if ( typeof(account.loading) == 'undefined' ) {
      //waiting to hear back from secure storage asyc call
      return null;
    }
    else if ( !account.UUID ) {
      if (__DEV__) console.log('Need to set up new account - first, scan the QR code')
      return <CodeScannerScreen onScanSuccess={this.handleScanSuccess} />
    }
    else if ( (!loginToken || !loginToken.valid) && !account.password ) {
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