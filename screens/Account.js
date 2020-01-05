import React from 'react';
import { connect } from 'react-redux';
import Constants from 'expo-constants';

import { View, Text, Image, ImageBackground } from 'react-native';
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

      <View style={mS.containerCenter}>

        <View style={mS.shadowBox}>

          <ImageBackground
            source={require('../assets/images/id.png')}
            style={{width: '100%', height: 50}}
          >
            <Text style={mS.boxTitle}>{'Support Information'}</Text>
          </ImageBackground>

          <View style={{marginLeft: 12, marginTop: 12}}>
            <Text style={mS.textUUID}>
              {'User ID'}: {uuid.toUpperCase()}
            </Text>
            <Text style={mS.textUUID}>
              {'SDK Version'}: {`${Constants.manifest.version}`}
            </Text>
          </View>

        </View>

        <View style={mS.shadowBox}>

          <ImageBackground
            source={require('../assets/images/id.png')}
            style={{width: '100%', height: 50}}
          >
            <Text style={mS.boxTitle}>{'Account Functions'}</Text>
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
        </View>
      </View>
    );
  }

}

const mapStateToProps = state => ({user: state.user});
export default connect(mapStateToProps)(Account);
