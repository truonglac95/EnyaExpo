import React from 'react';
import { connect } from 'react-redux';

// UI
import { TouchableOpacity, View, Text } from 'react-native';
import BasicButton from '../components/BasicButton';
import { mS } from '../constants/masterStyle';
import ProgressCircle from '../components/ProgressCircle';

// Redux and Actions
import { setAccount, FHEKeyGen as FHEKey} from '../redux/actions';
import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_ACCOUNT } from '../redux/constants';

class FHEKeyGen extends React.Component {
  
  constructor (props) {

    super(props);
  
    const { smc } = this.props.answer;

    this.state = {
      FHE_key_progress: (smc.FHE_key_progress || 0), //ranges from 0 to 100 and is a per key indicator 
      FHE_key_inventory: (smc.FHE_key_inventory || 0),
      FHE_key_statusMSG: (smc.FHE_key_statusMSG || 'no idea')
    }

  }
  
  UNSAFE_componentWillMount() {

    SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT).then(res => {
      
      const account = JSON.parse(res);

      if (( typeof(account.Key_id) == 'undefined' ) || 
          ( account.Key_id.length < 3 )) {
          console.log('Generating more keys...')
          this.props.dispatch(FHEKey());
      } else {
        //we have enough keys!
        this.setState({
          FHE_key_progress: 100,
          FHE_key_inventory: 3,
          FHE_key_statusMSG: 'Key store filled.',
        })
      }

    })

  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    this.setState({
      FHE_key_progress: (nextProps.answer.FHE_key_progress || 0),
      FHE_key_inventory: (nextProps.answer.FHE_key_inventory || 0),
      FHE_key_statusMSG: (nextProps.answer.FHE_key_statusMSG || 'Unknown'),
    })

  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text style={mS.screenTitle}>{'FHE Key Generation'}</Text>),
      headerRight: (<View></View>),
    }
  };

  render () {

    const { FHE_key_progress, FHE_key_inventory, FHE_key_statusMSG } = this.state;

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

const mapStateToProps = state => ({ 
  user: state.user,
  answer: state.answer,
});

export default connect(mapStateToProps)(FHEKeyGen);
