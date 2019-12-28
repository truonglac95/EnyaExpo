import React from 'react';
import { connect } from 'react-redux';

// UI
import { TouchableOpacity, View, Alert, Text } from 'react-native';
import BasicButton from '../components/BasicButton';
import mS from '../constants/masterStyle';
import colors from '../constants/Colors';

// Actions
import { burnEverything } from '../redux/actions';

class AccountDelete extends React.Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text 
        style={{
          fontSize: 19,
          color: colors.headerFontColor,
          marginLeft: 'auto', 
          marginRight: 'auto',
          textAlign: 'center',
          alignSelf: 'center',
        }}>
          {'Wipe Account'}
        </Text>
      ),
      headerRight: (<View></View>),
    }
  };

  constructor (props) {
    super(props);
  }

  handleDeleteAccount = () => {

    Alert.alert(
      'Wipe Account',
      'Are you sure you want to wipe your account?',
      [
        { text: 'Yes',
          onPress:()=>{this.props.dispatch(burnEverything())},
        }, 
        { text: 'No',
          onPress:()=>{},
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
    
  }

  render () {

    return (

<View style={mS.containerKAV}>

<View style={[mS.marTop20, {width: '84%'}]}>
  <Text style={mS.descriptionSmall}>{'This function will wipe all your information from this phone and reset the App.'}</Text>
</View>

<View style={mS.marTop20}>
  <BasicButton 
    text={'Wipe Account'} 
    onClick={this.handleDeleteAccount} 
  />
</View>

<View style={mS.marTop20}>
  <TouchableOpacity 
    onPress={()=>{this.props.navigation.goBack()}}>
    <Text style={mS.forgot}>{'Cancel'}</Text>
  </TouchableOpacity>
</View>

</View>
);}}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(AccountDelete);
