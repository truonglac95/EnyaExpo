import * as React from 'react';
import { connect } from 'react-redux';

// UI
import { Text, View } from 'react-native';
import BasicButton from '../components/BasicButton';
import { mS } from '../constants/masterStyle';

// Secure storage
import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_ACCOUNT } from '../redux/constants';

// Actions
import { setAccount } from '../redux/actions';
import * as EnyaDeliver from 'enyadeliver'

class CodeScanner extends React.Component {

  constructor (props) {
    super(props);
  }

handleBarCodeScannedSim = () => {

   let dataStringFromQRCodeScan = 'fba1b3c7564745b9284e7dfc73cf136d' +
  'd4ee9d7931c934690b7d7efb439935ae2897730316ac44816187d0d6629970f4' +
  '9c72b528bc7e8e4a8519555da095326be635dfba5eee3131ad82e25113a11bd8' +
  '679441e9962f6a8c881db713d874bc78bef72e7532fd7e45';

   let string = dataStringFromQRCodeScan;
  
  EnyaDeliver.QRGetStatus(string).then(result => {

    if (result.statuscode == 201){
      
      let status = result.status

      this.props.dispatch(setAccount({string: string, status: status}));
      SecureStore.setItemAsync(SECURE_STORAGE_ACCOUNT, JSON.stringify({string, status}));

    } else if (result.statuscode == 400){
      console.log("EnyaDeliver: Failed to connect to server.")
    } else {
      console.log("EnyaDeliver: Invalid QR code.")
    }
  })

};

  render() {

    return (

      <View style={mS.containerCenter}>

        <View style={mS.msgBoxVP}>
          <Text style={mS.titleTextVP}>{'Please scan your\nQR code card'}</Text>
        </View>

        <View>
          <BasicButton 
            text={'Simulate Valid Scan'}
            onClick={() => { this.handleBarCodeScannedSim() }} 
          />
        </View>

      </View>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });
export default connect(mapStateToProps)(CodeScanner);