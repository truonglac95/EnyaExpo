import React from 'react';
import { connect } from 'react-redux';
import { Platform, StatusBar, View } from 'react-native';

import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

import AppNavigator from './navigation/AppNavigator';
import LoginScreen from './screens/LoginScreen';
import CodeScannerScreen from './screens/CodeScannerScreen';
import AccountDeletedScreen from './screens/AccountDeletedScreen';
import AccountDeleteScreen from './screens/AccountDeleteScreen';

import appRoutes from "./AppRoutes";

//redux
import { 
  setAccount,
  getResults,
  getStatus,
  circulateStatus,
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

class MainApp extends React.Component {

  constructor (props) {
    super (props);
  }

  async componentDidMount() {
    
    //not sure what this does... need to check
    //still relevant?????
    this.props.dispatch(resetError());

    //once we login, we check for results
    this.props.dispatch(getResults(this.props.user.account.UUID));
  }

  UNSAFE_componentWillMount() {

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
        this.props.dispatch(circulateStatus(status));
      } else {
        //need to set up status
        if (__DEV__) console.log('MainApp: No status settings found - need to set up.');
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
      //if (__DEV__) console.log('Need to set up new account - scan the QR code')
      return <CodeScannerScreen />
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