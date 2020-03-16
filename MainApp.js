import React from 'react';
import { connect } from 'react-redux';
import appRoutes from "./AppRoutes";

// UI
import { Platform, StatusBar, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import AccountDeleted from './screens/AccountDeleted';

// Redux and Actions
import { setAccount, resetError, getAnswers, 
         FHEKeyGen, FHEKeyGenProgress } from './redux/actions';

import { SECURE_STORAGE_ACCOUNT } from './redux/constants';

import * as SecureStore from 'expo-secure-store';
import * as forge from 'node-forge';

class MainApp extends React.Component {

  constructor (props) {
    super (props);
  }

  UNSAFE_componentWillMount() {

    //load account settings, if any
    SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT).then(result => {
      if (result) {

        var account = JSON.parse(result);
        if (__DEV__) console.log('MainApp: Previous account found:', account);
        this.props.dispatch(setAccount(account));

        //update the number of keys in buffer
        var numberOfKeys = account.Key_id.length;

        this.props.dispatch( FHEKeyGenProgress({
          FHE_key_progress: 100,
          FHE_key_inventory: numberOfKeys,
          FHE_key_statusMSG: numberOfKeys > 2 ? 'Key store filled.' : 'Need to generate FHE keys.',
          FHE_keys_ready: account.Key_id.length > 2,
          FHE_key_computing: false
        }))

      } else {
        
        //need to set up account
        if (__DEV__) console.log('MainApp: No account found - set up new account.');
        var aes_key = forge.random.getBytesSync(16);
        let account = {
          aes_key,
          FHE_keys_ready: false,
          Key_id: [],
          loading: false,
        };
        if (__DEV__) console.log('MainApp: new account:', account)
        SecureStore.setItemAsync(SECURE_STORAGE_ACCOUNT, JSON.stringify(account));
        this.props.dispatch(setAccount(account));
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
  compute: state.compute,
  answer: state.answer,
});

export default connect(mapStateToProps)(MainApp);