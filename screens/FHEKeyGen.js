import React from 'react';
import { connect } from 'react-redux';

// UI
import { TouchableOpacity, View, Text } from 'react-native';
import BasicButton from '../components/BasicButton';
import { mS } from '../constants/masterStyle';

// Redux and Actions
import { setAccount, FHEKeyGen as FHEKey} from '../redux/actions';
import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_ACCOUNT } from '../redux/constants';

class FHEKeyGen extends React.Component {
  
  constructor (props) {
    super(props);
  }
  
  componentDidMount() {
    SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT).then(res => {

      const AccountInfo = JSON.parse(res);

      if (( typeof(AccountInfo.Key_id ) == 'undefined') || 
          ( AccountInfo.Key_id.length < 3 )) {
          this.props.dispatch(FHEKey())
       }

     })
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
