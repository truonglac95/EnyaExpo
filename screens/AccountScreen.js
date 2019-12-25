import React from 'react';
import { connect } from 'react-redux';
import { signOut } from '../redux/actions';

import { View, Text, StyleSheet, Platform, Image, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import BasicButton from '../components/BasicButton';
import mS from '../constants/masterStyle';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';

 import Constants from 'expo-constants';

import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_USER_ACCOUNT } from '../redux/constants';

class AccountScreen extends React.Component {

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
          {i18n.t('account_acount_head')}
        </Text>
      ),
    }
  };

  constructor (props) {
    super(props);
  }

  handleLogout = () => {

    SecureStore.getItemAsync(SECURE_STORAGE_USER_ACCOUNT
    ).then(result => {
      const account = result ? JSON.parse(result) : {};
      let updatedAccount = {
        ...account,
        staySignedIn: false,
      };
      SecureStore.setItemAsync(SECURE_STORAGE_USER_ACCOUNT, 
        JSON.stringify(updatedAccount)
        ).catch(err => {});
      this.props.dispatch(signOut(updatedAccount));
    }).catch(err => {});

  }

  render() {

    const uuid = this.props.user.account.UUID.substring(0, 8);
    
    return (

<View style={styles.containerCenter}>
<View style={styles.shadowBox}>

<ImageBackground
  source={require('../assets/images/id.png')}
  style={{width: '100%', height: 50 }}
>
  <Text style={styles.boxTitle}>{i18n.t('account_support')}</Text>
</ImageBackground>

<View style={{marginLeft: 12, marginTop: 12,}}>
  <Text style={styles.textUUID}>
    {i18n.t('account_user_id')}: {uuid.toUpperCase()}
  </Text>
  <Text style={styles.textUUID}>
    {i18n.t('account_version')}: {`${Constants.manifest.version}`}
  </Text>
</View>

<View style={{alignItems: 'center', justifyContent: 'flex-start',}}>
  <View style={{marginTop: 30, marginBottom: 20}}>
    <BasicButton 
      text={i18n.t('account_chat')} 
      icon="ios-chatbubbles" 
      onClick={()=>{this.props.navigation.navigate('Chat')}} 
    />
  </View>
</View>

</View>

<View style={styles.shadowBox}>

<ImageBackground
  source={require('../assets/images/id.png')}
  style={{width: '100%', height: 50}}
>
  <Text style={styles.boxTitle}>{i18n.t('account_acount_head')}</Text>
</ImageBackground>

<View style={{alignItems: 'center', justifyContent: 'flex-start',}}>
  <View style={{marginTop: 30}}>
  <BasicButton 
    text={i18n.t('account_sign_out')} 
    icon="ios-log-out" 
    onClick={this.handleLogout} 
  />
  </View>
  <View style={{marginTop: 30}}>
  <BasicButton 
    text={i18n.t('account_change_password')} 
    icon="ios-refresh" 
    onClick={()=>{this.props.navigation.navigate('PasswordChange')}} 
  />
  </View>
  <View style={{marginTop: 30, marginBottom: 20}}>
  <BasicButton 
    text={i18n.t('account_delete_account')} 
    icon="ios-trash" 
    onClick={()=>{this.props.navigation.navigate('AccountDelete')}} 
  />
  </View>
</View>

</View></View>);}}

const styles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#EEF2F9',
  },
  boxTitle: {
    fontSize: 19,
    lineHeight: 25,
    color: colors.headerFontColor,
    fontFamily: colors.headerFont,
    paddingTop: 10,
    paddingLeft: 12,
    paddingBottom: 10,
  },
  shadowBox: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    width: '96%',
    marginTop: 13, //spacing between boxes
    borderRadius: 9,
    borderWidth: 1,
    paddingBottom: 10, 
    borderColor: colors.homeBoxesLineColor,
    overflow: 'hidden',
  },
  //so people do not mix up zeros and 
  //capital O - which should never be 
  //there but that's a detail
  textUUID: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'roboto',
    fontWeight: 'normal',
    color: colors.darkGray,
    textAlign:'left',
    justifyContent:'center',
  },
  textVER: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'roboto',
    fontWeight: 'normal',
    color: colors.darkGray,
    textAlign:'center',
    justifyContent:'center',
  },
});

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(AccountScreen);
