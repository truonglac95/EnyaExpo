import * as React from 'react';
import { connect } from 'react-redux';

//Enya
import { SecureQRGetCredentials } from '../EnyaSDK/SecureQR';

//visuals and UI
import { Text, View } from 'react-native';
import BasicButton from '../components/BasicButton';
import mS from '../constants/masterStyle';

//secure storage
import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_USER_ACCOUNT } from '../redux/constants';

//redux
import { setAccount } from '../redux/actions';

class CodeScannerScreen extends React.Component {

  constructor (props) {
    super(props);
  }

handleBarCodeScannedSim = () => {

  let dataStringFromQRCodeScan = 'fba1b3c7564745b9284e7dfc73cf136d'  +
  'd4ee9d7931c934690b7d7efb439935ae2897730316ac44816187d0d6629970f4' +
  '9c72b528bc7e8e4a8519555da095326be635dfba5eee3131ad82e25113a11bd8' +
  '679441e9962f6a8c881db713d874bc78bef72e7532fd7e45';

  SecureQRGetCredentials( dataStringFromQRCodeScan ).then(result => {

    //wipe any old account just in case
    //the scanner should only ever be called 
    //when there is no account in the first place
    SecureStore.deleteItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(()=>{}).catch(()=>{});
   
    const firstlogintime = new Date().getTime().toString();
    const id = 'id-' + Math.random().toString(36).substring(2, 15) + '-' + firstlogintime;

    const account = result

    let newAccount = {
          ...account, 
          id: id,
    };

    //save to local secure storage
    SecureStore.setItemAsync(SECURE_STORAGE_USER_ACCOUNT, JSON.stringify(result));
  
    //circulate props to everyone else
    this.props.dispatch(setAccount(result));
    //at this point, there is a UUID availible to all etc.

  }).catch(err => {
    console.log(err)
  });

};

  render() {

    return (

      <View style={mS.containerCenter}>
        
        <View style={mS.msgBoxVP}>
          <Text style={mS.titleTextVP}>{'Please scan your\nQR code card'}</Text>
        </View>

        <View>
          <BasicButton 
            text={'Simulate Good Scan'}
            onClick={() => { this.handleBarCodeScannedSim() }} 
          />
        </View>
        

      </View>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(CodeScannerScreen);