import React from 'react';
import { connect } from 'react-redux';

import { View, Text, Image } from 'react-native';

import BasicButton from '../components/BasicButton';
import i18n from '../constants/Strings';
import mS from '../constants/masterStyle';

class AccountDeletedScreen extends React.Component {
  
  constructor (props) {
    super(props);
  }

  render () {

    return (

      <View style={mS.containerCenter}>

      <Image
        style={mS.valuePropVP}
        source={require('../assets/images/valueProp1.png')}
      />

      <View style={mS.msgBoxVP}>
        <Text style={mS.titleTextVP}>{i18n.t('account_account_deleted')}</Text>
        <Text style={mS.tagTextVP}>{i18n.t('account_create_notice')}</Text>
      </View>

      {/*'this fixes an issue where the android button sometimes overlaps with the text'*/}
      
      <View style={{height: 23}}/>
      {/*'this is where the slider will be on the next page'*/}
      
      <BasicButton 
        text={i18n.t('account_delete_ok')} 
        onClick={()=>{this.props.onWipeOut();}}
      />

      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(AccountDeletedScreen);
