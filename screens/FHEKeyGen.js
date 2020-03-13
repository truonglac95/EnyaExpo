import React from 'react';
import { connect } from 'react-redux';

// UI
import { TouchableOpacity, View, Text } from 'react-native';
import BasicButton from '../components/BasicButton';
import { mS } from '../constants/masterStyle';

class FHEKeyGen extends React.Component {
  
  constructor (props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text style={mS.screenTitle}>{'FHE Key Generation'}</Text>),
      headerRight: (<View></View>),
    }
  };

  render () {

    return (
      <View style={mS.containerKAV}>

        <View style={[mS.marTop20, {width: '84%'}]}>
          <Text style={mS.descriptionSmall}>{'Generating your FHE keys.'}</Text>
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
export default connect(mapStateToProps)(FHEKeyGen);
