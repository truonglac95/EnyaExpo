import React from 'react';
import { connect } from 'react-redux';
import Constants from 'expo-constants';

import { View, Text, StyleSheet, Platform, Image, 
  Dimensions, ImageBackground } from 'react-native';
import BasicButton from '../components/BasicButton';
import mS from '../constants/masterStyle';

class Account extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text style={mS.screenTitle}>{'Account'}</Text>),
    }
  };

  constructor (props) {
    super(props);
  }

  render() {

    const uuid = this.props.user.account.UUID.substring(0, 8);
    
    return (

<View style={styles.containerCenter}>
<View style={styles.shadowBox}>

<ImageBackground
  source={require('../assets/images/id.png')}
  style={{width: '100%', height: 50}}
>
  <Text style={styles.boxTitle}>{'Support Information'}</Text>
</ImageBackground>

<View style={{marginLeft: 12, marginTop: 12,}}>
  <Text style={styles.textUUID}>
    {'User ID'}: {uuid.toUpperCase()}
  </Text>
  <Text style={styles.textUUID}>
    {'SDK Version'}: {`${Constants.manifest.version}`}
  </Text>
</View>

</View>

<View style={styles.shadowBox}>

<ImageBackground
  source={require('../assets/images/id.png')}
  style={{width: '100%', height: 50}}
>
  <Text style={styles.boxTitle}>{'Account Functions'}</Text>
</ImageBackground>

<View style={{alignItems: 'center', justifyContent: 'flex-start'}}>
  <View style={{marginTop: 30, marginBottom: 20}}>
  <BasicButton 
    text={'Wipe Account'} 
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
    color: '#33337F',
    paddingTop: 10,
    paddingLeft: 12,
    paddingBottom: 10,
  },
  shadowBox: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    width: '96%',
    marginTop: 13,
    borderRadius: 9,
    borderWidth: 1,
    paddingBottom: 10, 
    borderColor: '#33337F',
    overflow: 'hidden',
  },
  textUUID: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'normal',
    color: '#404040',
    textAlign:'left',
    justifyContent:'center',
  },
});

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(Account);
