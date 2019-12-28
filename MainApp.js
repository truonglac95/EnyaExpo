import React from 'react';
import { connect } from 'react-redux';
import { Platform, StatusBar, View } from 'react-native';

import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

import AppNavigator from './navigation/AppNavigator';
import CodeScanner from './screens/CodeScanner';
import AccountDeleted from './screens/AccountDeleted';
import AccountDelete from './screens/AccountDelete';

import appRoutes from "./AppRoutes";

//redux
import { 
  setAccount,
  getResults,
  resetError,
} from './redux/actions';

import * as SecureStore from 'expo-secure-store';

import { 
  SECURE_STORAGE_ACCOUNT,
  SECURE_STORAGE_RESULT,
} from './redux/constants';

const pdfStore = `${FileSystem.documentDirectory}User/PDFs`;

class MainApp extends React.Component {

  constructor (props) {
    super (props);
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
    SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT).then(result => {
      if (result) {
        const account = result ? JSON.parse(result) : {};
        if (__DEV__) console.log('MainApp: Previous account found.');
        let updatedAccount = {
          ...account,
          loading: false,
        };
        this.props.dispatch(setAccount(updatedAccount));
      } else {
        //need to set up account
        if (__DEV__) console.log('MainApp: No account found - set up new account.');
        this.props.dispatch(setAccount({loading: false}));
        //In production app triggers flow through QR code, T&C, and password, etc.
      }
    }).catch(err => {
      if (__DEV__) console.log(err);
    });

  }

  componentDidMount() {
    //resets everything after app delete
    this.props.dispatch(resetError());
  }

  render() {

    const { account } = this.props.user;

    if ( this.props.user.deleted ) {
      console.log('User just wiped their account')
      return <AccountDeleted onWipeOut={this.props.onWipeOut}/>
    }
    else if ( typeof(account.loading) == 'undefined' ) {
      //waiting to hear back from secure storage asyc call
      return null;
    }
    else if ( !account.UUID ) {
      console.log('need to scan QR code')
      return <CodeScanner />
    }
    else {
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