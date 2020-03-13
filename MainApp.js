import React from 'react';
import { connect } from 'react-redux';
import appRoutes from "./AppRoutes";

// UI
import { Platform, StatusBar, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import AccountDeleted from './screens/AccountDeleted';

// Redux and Actions
import { setAccount, resetError, getAnswers, FHEKeyGen } from './redux/actions';
import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_ACCOUNT } from './redux/constants';
import * as forge from 'node-forge';

class MainApp extends React.Component {

  constructor (props) {

    super (props);

  }

  UNSAFE_componentWillMount() {

    //load account settings, if any
    SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT).then(result => {
      if (result) {
        if (__DEV__) console.log('MainApp: Previous account found.');
        var account = JSON.parse(result);
        account.FHE_indicator = false;
        let updatedAccount = {
          ...account,
          loading: false,
        };
        this.props.dispatch(setAccount(updatedAccount));
      } else {
        //need to set up account
        if (__DEV__) console.log('MainApp: No account found - set up new account.');
        var aes_key = forge.random.getBytesSync(16);
        let newAccount = {
          aes_key,
          fhe_ready: false, //no FHE keys stored yet
          FHE_indicator: false,
          Key_id: [],
          loading: false,
        };
        SecureStore.setItemAsync(SECURE_STORAGE_ACCOUNT, JSON.stringify(newAccount));
        this.props.dispatch(setAccount(newAccount));
        //In production app triggers flow through QR code, T&C, and password, etc.
      }
    }).catch(err => {
      if (__DEV__) console.log(err);
    });

  }

  componentDidMount() {

    //resets everything after app delete
    this.props.dispatch(resetError());
    this.props.dispatch(getAnswers());

    SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT).then(res => {
      if (res) {
        var AccountInfo = JSON.parse(res);
        AccountInfo.FHE_indicator = false;       
        if (__DEV__) console.log('MainApp: Previous AES key found.')
        SecureStore.setItemAsync(SECURE_STORAGE_ACCOUNT, JSON.stringify(AccountInfo));
        this.props.dispatch(setAccount(AccountInfo));
       } else {
         if (__DEV__) console.log('MainApp: Generating AES key')
         var AccountInfo = res ? JSON.parse(res) : {};
         AccountInfo.Key_id = [];
         var aes_key = forge.random.getBytesSync(16);
         let Account ={
           ...AccountInfo,
           aes_key,
         }
         SecureStore.setItemAsync(SECURE_STORAGE_ACCOUNT, JSON.stringify(Account));
       }
     })
  
  }

  render() {

    const { account } = this.props.user;

    if ( this.props.user.deleted ) {
      if (__DEV__) console.log('MainApp: User just wiped their account')
      return <AccountDeleted onWipeOut={this.props.onWipeOut}/>
    }
    else if ( typeof(account.loading) == 'undefined' ) {
      return null;
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
});

export default connect(mapStateToProps)(MainApp);