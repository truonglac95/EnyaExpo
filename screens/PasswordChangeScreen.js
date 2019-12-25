import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, View, Text, KeyboardAvoidingView, Platform } from 'react-native';

import PasswordInput from '../components/PasswordInput';
import BasicButton from '../components/BasicButton';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';
import mS from '../constants/masterStyle';

import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_USER_ACCOUNT } from '../redux/constants';
import { changePassword } from '../redux/actions';

class PasswordChangeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
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
          {i18n.t('password_change_header')}
        </Text>
      ),
      headerRight: (<View></View>),
    }
  };

  constructor (props) {

    super(props);

    this.state = {
      saved_password: '', 
      password_field_1: '', 
      password_field_2: '',
      error: '',
      success: '',
    };

  }

  handleChangePassword = () => {

    const { saved_password, password_field_1, password_field_2 } = this.state;

    this.setState({
      error: '',
      success: '',
    });

    if (!saved_password || !password_field_1 || !password_field_2) {
      this.setState({
        error: 'MISSING_PARAMETER',
      });
    } else if (password_field_1 !== password_field_2) {
      this.setState({
        error: 'PASSWORD_MISMATCH',
      });
    } else if (password_field_1 === saved_password) {
      this.setState({
        error: 'PASSWORD_SAME',
      });
    } else {
      SecureStore.getItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(result => {
        if (result) {
          const res = JSON.parse(result);
          if (res.password !== saved_password) {
            this.setState({
              error: 'INCORRECT_OLD_PASSWORD',
            });
          } else {
            this.setState({
              success: i18n.t('password_Password_Changed'), // 'Password Successfully Changed',
            });
            SecureStore.setItemAsync(SECURE_STORAGE_USER_ACCOUNT, JSON.stringify({
              ...res,
              password: password_field_1,
            }));
            this.props.navigation.navigate('Account');
          }
        }
      }).catch(err => {});
    }
  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  }

  render () {
    
    const {
      saved_password,
      password_field_1,
      password_field_2,
      success,
    } = this.state;
    
    const { user } = this.props;
    const loading = !!user.loading || !!user.changePasswordLoading;
    const error = this.state.error || user.changePasswordError;
    
    let errorMessage = '';

    switch (error) {
      case 'INCORRECT_OLD_PASSWORD':
        errorMessage = i18n.t('password_incorrect_password');
        break;
      case 'MISSING_PARAMETER':
        errorMessage = i18n.t('password_missing_parameter');
        break;
      case 'PASSWORD_MISMATCH':
        errorMessage = i18n.t('password_password_mismatch');
        break;
      case 'PASSWORD_SAME':
        errorMessage = i18n.t('password_password_same');
        break;
    }

    return (

<KeyboardAvoidingView 
  style={mS.containerKAV} 
  behavior={"padding"}
  keyboardVerticalOffset={Platform.select({ ios: -80, android: -78 })}
>

{!errorMessage && 
  <View style={mS.errorBox}>
    <Text style={mS.errorText}>{` `}</Text>
  </View>
}

{!!errorMessage && 
  <View style={mS.errorBox}>
    <Text style={mS.errorText}>{errorMessage}</Text>
  </View>
}

<View style={[mS.passwordRow, {marginTop: 0}]}>
  <PasswordInput
    label={i18n.t('password_current_password')}
    password={saved_password}
    onChange={(v) => { this.handleChange('saved_password', v); }}
  />
</View>

<View style={mS.passwordRow}>
  <PasswordInput
    label={i18n.t('password_new_password')}
    password={password_field_1}
    onChange={(v) => { this.handleChange('password_field_1', v); }}
  />
</View>

<View style={mS.passwordRow}>
  <PasswordInput
    label={i18n.t('password_confirm_password')}
    password={password_field_2}
    onChange={(v) => { this.handleChange('password_field_2', v); }}
  />
</View>

{/*change password*/}
{!loading && 
<View style={mS.marTop20}>
  <BasicButton 
    text={i18n.t('password_change_password')} 
    onClick={this.handleChangePassword} 
  />
</View>
}

{/*cancel*/}
{!loading && 
  <View style={mS.marTop20}>
  <TouchableOpacity onPress={() => { this.props.navigation.goBack(); }} >
    <Text style={mS.forgot}>{i18n.t('password_cancel')}</Text>
  </TouchableOpacity>
</View>
}

</KeyboardAvoidingView>

);}}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(PasswordChangeScreen);
