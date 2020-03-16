import React from 'react';
import { connect } from 'react-redux';

// UI
import Constants from 'expo-constants';
import { View, Text, Image, ImageBackground, ScrollView } from 'react-native';
import BasicButton from '../components/BasicButton';
import { mS } from '../constants/masterStyle';

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

    return (

      <View style={mS.containerCenterA}>
      <ScrollView 
        contentContainerStyle={{alignItems: 'center'}}
        showsVerticalScrollIndicator={false}
        overScrollMode={'always'}
      >

        <View style={mS.shadowBox}>
          <ImageBackground source={require('../assets/images/id.png')} style={{height: 50}}>
            <Text style={mS.boxTitle}>{'Support Information'}</Text>
          </ImageBackground>
          <View style={{marginLeft: 12, marginTop: 12}}>
            <Text style={mS.textUUID}>{'SDK Version'}: {`${Constants.manifest.version}`}</Text>
          </View>
        </View>

        <View style={mS.shadowBox}>
          <ImageBackground source={require('../assets/images/id.png')} style={{height: 50}}>
            <Text style={mS.boxTitle}>{'Account Functions'}</Text>
          </ImageBackground>
          <View style={{marginLeft: 14, marginTop: 12}}>
            <Text style={[mS.textUUID, {fontSize: 14}]}>{'To use FHE, you need to first generate various keys. Depending on your phone hardware, this could take several minutes. You only need to do this once.'}</Text>
          </View>
          <View style={{alignItems: 'center', justifyContent: 'flex-start'}}>
            <View style={{marginTop: 30, marginBottom: 10}}>
              <BasicButton 
                text={'Generate FHE Keyset'} 
                icon="ios-key" 
                onClick={()=>{this.props.navigation.navigate('FHEKeyGen')}} 
              />
            </View>
            <View style={{marginTop: 20, marginBottom: 20}}>
              <BasicButton 
                text={'Wipe Account'} 
                icon="ios-trash" 
                onClick={()=>{this.props.navigation.navigate('AccountDelete')}}
              />
            </View>
          </View>
        </View>

      </ScrollView>
      </View>
    );
  }

}

const mapStateToProps = state => ({user: state.user});
export default connect(mapStateToProps)(Account);
