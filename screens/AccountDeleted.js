import React from 'react';
import { connect } from 'react-redux';

// UI
import { View, Text, Image } from 'react-native';
import BasicButton from '../components/BasicButton';
import { mS } from '../constants/masterStyle';

class AccountDeleted extends React.Component {

  render () {

    return (

      <View style={mS.containerCenter}>

      <Image
        style={mS.valuePropVP} 
        source={require('../assets/images/valueProp1.png')}
      />

      <View style={mS.msgBoxVP}>
        <Text style={mS.titleTextVP}>{'Account Wiped'}</Text>
      </View>

      <View style={{height: 40}}/>

      <BasicButton 
        text={'Ok'} 
        onClick={()=>{this.props.onWipeOut()}}
      />

      </View>
      
    );
  }
}

const mapStateToProps = state => ({user: state.user});
export default connect(mapStateToProps)(AccountDeleted);