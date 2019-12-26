import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, Platform, View, Alert, Text, KeyboardAvoidingView } from 'react-native';

import PasswordInput from '../components/PasswordInput';

import BasicButton from '../components/BasicButton';
import i18n from '../constants/Strings';
import mS from '../constants/masterStyle';

import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_USER_ACCOUNT } from '../redux/constants';

import { burnEverything } from '../redux/actions';
import colors from '../constants/Colors';

class AccountDelete extends React.Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text 
        style={{
          fontSize: 19,
          color: colors.headerFontColor,
          fontFamily: colors.headerFont,
          marginLeft: 'auto', 
          marginRight: 'auto',
          textAlign: 'center',
          alignSelf: 'center',
        }}>
          {i18n.t('account_delete')}
        </Text>
      ),
      headerRight: (<View></View>),
    }
  };

  constructor (props) {

    super(props);

    this.state = {
      password: '',
      error: '',
      success: '',
    };

  }

  handleDeleteAccount = () => {

            Alert.alert(
              i18n.t('account_delete_title'),
              i18n.t('account_delete_alert'),
              [
                {
                  text: i18n.t('account_yes'),
                  onPress: () => {
                    this.props.dispatch(burnEverything());
                  },
                }, {
                  text: i18n.t('account_no'),
                  onPress: () => {},
                  style: 'cancel',
                },
              ],
              { cancelable: false },
            );

  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  }

  render () {
    
    const {
      password,
      error,
      success,
    } = this.state;

    return (

<KeyboardAvoidingView 
  style={mS.containerKAV} 
  behavior={"padding"}
  keyboardVerticalOffset={Platform.select({ ios: -80, android: -78 })}
>

{/*general instructions at top of page*/}
<View style={[mS.marTop20, {width: '84%'}]}>
  <Text style={mS.descriptionSmall}>{i18n.t('account_delete_password')}</Text>
</View>

{/*action button*/}
<View style={mS.marTop20}>
  <BasicButton 
    text={i18n.t('account_delete')} 
    onClick={this.handleDeleteAccount} 
  />
</View>

{/*cancel*/}
<View style={mS.marTop20}>
  <TouchableOpacity 
    onPress={() => { this.props.navigation.goBack(); }} >
    <Text style={mS.forgot}>{i18n.t('password_cancel')}</Text>
  </TouchableOpacity>
</View>

</KeyboardAvoidingView>

);}}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(AccountDelete);
