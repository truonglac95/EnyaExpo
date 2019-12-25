import React from 'react';
import { connect } from 'react-redux';

//Use local biometrics
import * as LocalAuthentication from 'expo-local-authentication';

import BasicButton from '../components/BasicButton';
import PasswordInput from '../components/PasswordInput';

import colors from '../constants/Colors';
import mS from '../constants/masterStyle';
import i18n from '../constants/Strings';

import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Image,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';

//local storage
import * as SecureStore from 'expo-secure-store';

import { 
  SECURE_STORAGE_USER_ACCOUNT,
  SECURE_STORAGE_USER_FLOW,
  SECURE_STORAGE_USER_RESULT,
  SECURE_STORAGE_USER_STATUS,
} from '../redux/constants';

//actions
import { 
  setAccount, 
  signinTokenGen, 
  getResults,
  getAnswers,
  getStatus,
  updateUser_DB,
} from '../redux/actions';

class LoginScreen extends React.Component {
  
  constructor (props) {

    super(props);

    //remove superfluous header material when keyboard is up
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
    this._keyboardDidHide = this._keyboardDidHide.bind(this)

    this.state = {
      saved_password: '',
      password_field_1: '',
      password_field_2: '',
      error: '',
      loading: false,
      alreadySignedup: this.props.login, //this is set by MainApp
      staySignedIn: this.props.user.account.staySignedIn,
      showForgotPassword: false,
      agreeTerms: true,
      keyboardUp: false,
      haveBiometrics: null,
    };

  }

  UNSAFE_componentWillMount() {

  SecureStore.getItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(result => {

    const account = result ? JSON.parse(result) : {};
    //if (__DEV__) console.log('Login user account cDM() contents:', account);
    if ( account.UUID !== '' ) {
      //yes, we have scanned the QR code
      //if (__DEV__) console.log('password:', account.password);
      if ( account.password !== '' && (typeof account.password !== 'undefined') ) {
        //if (__DEV__) console.log('Yes we have a password');
        //yes, we have set a password
        if( account.staySignedIn ) {
          this.setState({
            password_field_1: account.password, //we fill out correct password so user only has to click login
            saved_password: account.password,
            alreadySignedup: true,
            loading: false,
            staySignedIn: true,
          });
        }
        else {
          this.setState({
            password_field_1: '', //user has to fill in correct password
            saved_password: account.password,
            alreadySignedup: true,
            loading: false,
            staySignedIn: false,
          });
        }
      } else {
        //if (__DEV__) console.log('Password not yet set: need to set one');
        this.setState({
            alreadySignedup: false,
            loading: false,
            staySignedIn: false,
          });
      }
    }
  });
} //componentWillMount

  componentDidMount() {

    this._checkDeviceForHardware();
    
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

  }

  componentWillUnmount() {

    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();

  }

  _checkDeviceForHardware = async () => {

    let haveBiometrics = await LocalAuthentication.hasHardwareAsync();
    this.setState({ haveBiometrics });

  };

  scanBiometrics = async () => {

    let biometricRecords = await LocalAuthentication.isEnrolledAsync();
    
    if (!biometricRecords) {
      //after several failed biometrics attempts, 
      //await LocalAuthentication.isEnrolledAsync() will return false
      this.setState({ 
        //need to sign in the old fashioned way
        //make person log in with password, as before
        error: 'BIOMETRICS_NOT_AVAILABLE', 
        password_field_1: '',
        haveBiometrics: false 
      });
      return;
    }

    if (Platform.OS === 'android') {
      Alert.alert('Fingerprint Scan', 'Place your finger over the touch sensor.');
    }

    let result = await LocalAuthentication.authenticateAsync();
    
    if (result.success) {
      this.setState({ 
        //autofill in the password field, and log them in
        password_field_1: this.state.saved_password 
      });
      this.handleLogin(true);
    } else {
      this.setState({
        //after a few tries, they will get locked out
        //then they will have to log in the old way, with a password, which 
        //we will obviously _not_ fill in for them
        error: 'BIOMETRICS_FAILED' 
      });
    }

  };

  _keyboardDidShow() {
    this.setState({ keyboardUp: true });
  }

  _keyboardDidHide() {
    this.setState({ keyboardUp: false });
  }

  handleLogin = (isAuthenticated) => {

    const { password_field_1, password_field_2, saved_password, 
            alreadySignedup, staySignedIn } = this.state;

    //always need entry for password_field_1, regardless
    if (!password_field_1 && !isAuthenticated) {
      this.setState({
        error: 'MISSING_PARAMETER',
      });
      return;
    } 

    //standard signin
    if ( isAuthenticated || (alreadySignedup && (password_field_1 === saved_password)) ) {

      SecureStore.getItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(result => {
        if (result){
          const account = result ? JSON.parse(result) : {};
          let id = account.id;
          let nickname = account.nickname;
          //successful login always sets staySignedIn = true
          //only ever is false right after user has signed out
          if (__DEV__) console.log('Standard sign in');
          let newAccount = { ...account, staySignedIn: true };
          SecureStore.setItemAsync(SECURE_STORAGE_USER_ACCOUNT, JSON.stringify(newAccount));
          this.setState({ staySignedIn: true });
          this.finishAccountSetup(id, nickname, account.UUID);
        } else {
          if (__DEV__) console.log('handleLogin() - this should never happen')
        }
      }).catch(err => {
        //something really weird just happened
        //do not signinTokenGen 
      });

      //check for stored data
      SecureStore.getItemAsync(SECURE_STORAGE_USER_RESULT).then(result => {
        if (__DEV__) console.log('Login: local results check')
        if (result) {
          if (__DEV__) console.log('Login: local results and keys found.')
          const localResult = result ? JSON.parse(result) : {};
          //distribute crypto keys among other things
          this.props.dispatch(circulateLocalResults(localResult));
        } else {
          if (__DEV__) console.log('Login: no local results or keys found.')
        }
      }).catch(err => {
        //something really weird just happened
        //do not signinTokenGen 
      });

    } //closes standard signin

    //old fashioned login but password wrong
    if ( alreadySignedup && (password_field_1 !== saved_password) ) {
      this.setState({
        error: 'WRONG_PASSWORD',
      });
      return;
    };

    //new signup but passwords do not match
    if ( !alreadySignedup && (password_field_1 !== password_field_2) ) {
      this.setState({
        error: 'PASSWORD_MISMATCH',
      });
      return;
    };

    //new signup and passwords match
    if ( !alreadySignedup && (password_field_1 === password_field_2) ) {
      
      this.setState({ error: '' });

      SecureStore.getItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(result => {

        const account = result ? JSON.parse(result) : {};

        const firstlogintime = new Date().getTime().toString();
        const id = 'id-' + Math.random().toString(36).substring(2, 15) + '-' + firstlogintime;
        const nickname = 'name-' + Math.random().toString(36).substring(2, 15) + '-' + firstlogintime;

        let newAccount = {
          ...account, 
          //much of this - like the uuid - is filled in during the QR code scanning
          password: password_field_1,
          id: id,
          nickname: nickname,
          staySignedIn: true,
          accepted: true,
          accepted_terms_date: firstlogintime,
        };

        let updatedFlow = {
          signedUp: true,
        };

        SecureStore.setItemAsync(SECURE_STORAGE_USER_ACCOUNT, JSON.stringify(newAccount));
        SecureStore.setItemAsync(SECURE_STORAGE_USER_FLOW, JSON.stringify(updatedFlow));

        //locally distributes user data
        this.props.dispatch(setAccount(newAccount));

        //updates values in remote database
        this.props.dispatch(updateUser_DB(account.UUID, {
          accepted: true,
          accepted_terms_date: firstlogintime,
        }));
        
        //gets answers, results, and generates token
        this.finishAccountSetup(id, nickname, account.UUID);

      });
    }//closes new signup

  } //closes handle login

  finishAccountSetup = (id, nickname, uuid) => {

    const { dispatch } = this.props;

    dispatch(getAnswers());
    dispatch(getResults(uuid));
    dispatch(getStatus(uuid));

    dispatch(signinTokenGen({
      id, 
      nickname, 
      valid: true,
    }));
  
  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  }

  render () {

    const {
      password_field_1,
      password_field_2,
      alreadySignedup,
      loading,
      error,
      staySignedIn,
      showForgotPassword,
      agreeTerms,
      keyboardUp,
      haveBiometrics,
    } = this.state;

    let errorMessage = '';

    let internet = this.props.user.internet.internet_connected;

    if (!internet && !alreadySignedup) { errorMessage = i18n.t('login_no_internet'); }

    switch ( error ) {
      case 'MISSING_PARAMETER':
        errorMessage = i18n.t('login_Please_fill_in_all_fields');
        break;
      case 'WRONG_PASSWORD':
        errorMessage = i18n.t('login_Password_is_not_correct');
        break;
      case 'PASSWORD_MISMATCH':
        errorMessage = i18n.t('login_Passwords_do_not_match');
        break;
      case 'BIOMETRICS_NOT_AVAILABLE':
        errorMessage = 'Biometrics not available. Sign in with password.';
        break;
      case 'BIOMETRICS_FAILED':
        errorMessage = 'Biometric authentication failed.';
        break;
    }

    let actionButton = '';
    let description = '';
    
    if ( alreadySignedup ) { //this is set by MainApp
      actionButton = i18n.t('login_Sign_In');
      description = haveBiometrics ? 'Biometric Authentication' : i18n.t('login_Enter_your_password');
    } else {
      actionButton = i18n.t('login_Create_Account');
      description = i18n.t('login_Create_your_password');
    }

    return (

    <KeyboardAvoidingView 
      style={mS.containerKAV} 
      behavior="padding"
    >
      {!keyboardUp && 
        <View style={{alignItems: 'center',justifyContent: 'center'}}>
          <Image
            style={mS.topLogo}
            source={require('../assets/images/logo.png')}
          />
          <View style={mS.marTop20}>
            <Text style={mS.description}>{description}</Text>
          </View>
        </View>
      }

      {/*the next (blank) line prevents stuff from jumping 
      around if there is an error message*/}
      {!errorMessage && 
        <View style={[mS.errorBox, keyboardUp ? {marginTop: 40} : {marginTop: 0 }]}>
          <Text style={mS.errorText}>{` `}</Text>
        </View>
      }
      {!!errorMessage && 
        <View style={[mS.errorBox, keyboardUp ? {marginTop: 40} : {marginTop: 0 }]}>
          <Text style={mS.errorText}>{errorMessage}</Text>
        </View>
      }

      {/*initial signup case*/}
      {!alreadySignedup && <View>
          <View style={mS.passwordRow}>
            <PasswordInput
              label={i18n.t('login_Enter_Password')}
              password={password_field_1}
              onChange={(v)=>{this.handleChange('password_field_1',v)}}
            />
          </View>
          <View style={mS.passwordRow}>
            <PasswordInput
              label={i18n.t('login_Confirm_Password')}
              password={password_field_2}
              onChange={(v) => { this.handleChange('password_field_2', v); }}
            />
          </View>
        </View>
      }

      {/*signedup with old phone without biometrics, or biometrics disabled*/}
      {(!haveBiometrics && !!alreadySignedup) && 
        <View style={mS.passwordRow}>
          <PasswordInput
            label={i18n.t('login_Enter_Password')}
            password={password_field_1}
            onChange={(v)=>{this.handleChange('password_field_1',v)}}
          />
        </View>
      }

      <View style={mS.marTop20}>
        <BasicButton 
          text={actionButton} 
          onClick={() => { haveBiometrics && alreadySignedup ? this.scanBiometrics() : this.handleLogin( false ) }}
          no_internet={!internet && !alreadySignedup}
          todo={i18n.t('login_no_internet')}
          title={i18n.t('home_internet_title')}
        />
      </View>

      </KeyboardAvoidingView>);
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(LoginScreen);