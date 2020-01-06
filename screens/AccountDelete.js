import React from 'react';
import { connect } from 'react-redux';

// UI
import { TouchableOpacity, View, Text } from 'react-native';
import BasicButton from '../components/BasicButton';
import { mS } from '../constants/masterStyle';

// Actions
import { burnEverything } from '../redux/actions';

class AccountDelete extends React.Component {
  
  constructor (props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text style={mS.screenTitle}>{'Wipe Account'}</Text>),
      headerRight: (<View></View>),
    }
  };

  handleWipeAccount = () => {
    this.props.dispatch(burnEverything())
  }

  render () {

    return (
      <View style={mS.containerKAV}>

        <View style={[mS.marTop20, {width: '84%'}]}>
          <Text style={mS.descriptionSmall}>{'This function will wipe all' + 
          'your information from this phone and reset the App.'}</Text>
        </View>

        <View style={mS.marTop20}>
          <BasicButton 
            text={'Wipe Account'} 
            onClick={this.handleWipeAccount} 
          />
        </View>

        <View style={mS.marTop20}>
          <TouchableOpacity 
            onPress={()=>{this.props.navigation.goBack()}}>
            <Text style={mS.forgot}>{'Cancel'}</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }

}

const mapStateToProps = state => ({ user: state.user });
export default connect(mapStateToProps)(AccountDelete);
