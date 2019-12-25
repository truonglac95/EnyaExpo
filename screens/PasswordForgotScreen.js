import React from 'react';
import { connect } from 'react-redux';

import { Alert, TouchableOpacity, View, Text, Image } from 'react-native';

import BasicButton from '../components/BasicButton';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';
import mS from '../constants/masterStyle';

import { burnEverything } from '../redux/actions';

class PasswordForgotScreen extends React.Component {

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
          {i18n.t('forget_password_header')}
        </Text>
      ),
    }
  };

  constructor (props) {
    super(props);
  }

  handleWipeAccount = () => {
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
          style: i18n.t('account_cancel'),
        },
      ],
      { cancelable: false },
    );

  }

  render () {

    return (

<View style={mS.basicContainer}>

<View style={mS.marTop20}>
  <Text style={mS.descriptionSmall}>{i18n.t('forget_password_security')}</Text>
  <Text style={mS.descriptionSmall}>{i18n.t('forget_password_info')}</Text>

  <Text style={[mS.descriptionSmall, {marginTop: 20}]}>1.{` `}{i18n.t('forget_password_step1')}</Text>
  <Text style={mS.descriptionSmall}>2.{` `}{i18n.t('forget_password_step2')}</Text>
  <Text style={mS.descriptionSmall}>3.{` `}{i18n.t('forget_password_step3')}</Text>
  <Text style={mS.descriptionSmall}>4.{` `}{i18n.t('forget_password_step4')}</Text>
  
  {/*Try to enter password again*/}
  <Text style={[mS.descriptionSmall, {marginTop: 20}]}>{i18n.t('forget_password_try')}
    <Text style={{fontWeight: 'bold'}}>{i18n.t('forget_password_go_back')}</Text>
    {i18n.t('forget_password_below')}
  </Text>
</View>

{/*Delete Account*/}
<View style={mS.marTop20}>
  <BasicButton 
    text={i18n.t('forget_password_delete')} 
    onClick={this.handleWipeAccount}
  />
</View>

{/*Go back to sign in*/}
<View style={mS.marTop20}>
  <TouchableOpacity 
    onPress={this.props.onBack}>
    <Text style={mS.forgot}>{i18n.t('forget_password_go_back')}</Text>
  </TouchableOpacity>
</View>

</View>);}}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(PasswordForgotScreen);
