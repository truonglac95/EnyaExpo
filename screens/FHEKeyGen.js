import React from 'react';
import { connect } from 'react-redux';

// UI
import { TouchableOpacity, View, Text } from 'react-native';
import BasicButton from '../components/BasicButton';
import { mS } from '../constants/masterStyle';
import ProgressCircle from '../components/ProgressCircle';

// Redux and Actions
import { FHEKeyGen as FHEKey} from '../redux/actions';
import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_ACCOUNT } from '../redux/constants';

class FHEKeyGen extends React.Component {
  
  constructor (props) {

    super(props);

    const { progress } = this.props.fhe;

    this.state = {
      FHE_key_progress: (progress.FHE_key_progress || 0), //ranges from 0 to 100 and is a per key indicator 
      FHE_key_inventory: (progress.FHE_key_inventory || 0),
      FHE_key_statusMSG: (progress.FHE_key_statusMSG || 'Unknown'),
      FHE_keys_ready: (progress.FHE_keys_ready || false),
      FHE_key_computing: (progress.FHE_key_computing || false)
    }

  }
  
  UNSAFE_componentWillMount() {

    SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT).then(res => {
      
      const account = JSON.parse(res);

      console.log('FHE keygen account:', account)

      if ( account.FHE_keys_ready == false || account.Key_id.length < 3 ) {
        //if (( typeof(account.Key_id) == 'undefined' ) || ( account.Key_id.length < 3 )) {
          console.log('Generating more keys...')
          this.props.dispatch(FHEKey());
        } else {
          //we have enough keys...
          console.log('Have enough keys...')
          this.setState({
            FHE_key_progress: 100,
            FHE_key_inventory: 3,
            FHE_key_statusMSG: 'Key store filled.',
            FHE_keys_ready: true,
            FHE_key_computing: false
          })
        }
      //}
    })
  
  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    const { progress } = nextProps.fhe;

    this.setState({
      FHE_key_progress: (progress.FHE_key_progress || 0),
      FHE_key_inventory: (progress.FHE_key_inventory || 0),
      FHE_key_statusMSG: (progress.FHE_key_statusMSG || 'Unknown'),
      FHE_keys_ready: (progress.FHE_keys_ready || false),
      FHE_key_computing: (progress.FHE_key_computing || false)
    })

  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text style={mS.screenTitle}>{'FHE Key Generation'}</Text>),
      headerRight: (<View></View>) //
    }
  };

  //

  render () {

    const { FHE_key_progress, FHE_key_inventory, 
            FHE_key_statusMSG, FHE_key_computing, 
            FHE_keys_ready } = this.state;

    return (
      <View style={mS.containerKAV}>

        <View style={[mS.marTop20, {width: '84%'}]}>
          { FHE_key_inventory < 3 &&
            <Text style={[mS.progressText,{fontWeight: 'bold'}]}>{'Generating FHE keys.\nThis may take several minutes.'}</Text>
          }
          { FHE_key_inventory >= 3 &&
            <Text style={[mS.progressText,{fontWeight: 'bold'}]}>{'FHE keys generated.'}</Text>
          }
          { FHE_key_inventory != 1 &&
            <Text style={mS.progressText}>{'There are '}
              <Text style={{fontWeight: 'bold'}}>{FHE_key_inventory}</Text>
              {' keys in your keystore.'}
            </Text>
          }
          { FHE_key_inventory == 1 &&
            <Text style={mS.progressText}>{'There is '}
              <Text style={{fontWeight: 'bold'}}>{'1'}</Text>
              {' key in your keystore'}
            </Text>
          }
          <Text style={[mS.progressText,{marginBottom:20}]}>{FHE_key_statusMSG}</Text>
        </View>

        {FHE_key_inventory < 3 &&
          <View style={mS.circleProgress}>
            <ProgressCircle percent={FHE_key_progress} cog={true}/>
            <TouchableOpacity
              style={{marginTop: 30}} 
              onPress={()=>{this.props.navigation.goBack()}}>
              <Text style={[mS.forgot,{fontWeight: 'bold'}]}>{'Cancel'}</Text>
            </TouchableOpacity>
          </View>
        }

      </View>
    );
  }

}

const mapStateToProps = state => ({ fhe: state.fhe });
export default connect(mapStateToProps)(FHEKeyGen);
