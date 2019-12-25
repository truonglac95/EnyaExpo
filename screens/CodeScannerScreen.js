import * as React from 'react';
import { connect } from 'react-redux';

import { Text, View, StyleSheet, Button, Image, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import BasicButton from '../components/BasicButton';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';
import mS from '../constants/masterStyle';

import forge from 'node-forge';

import { SECURE_STORAGE_USER_ACCOUNT } from '../redux/constants';
import { setAccount, signupUser_DB } from '../redux/actions';

class CodeScannerScreen extends React.Component {

  constructor (props) {
    
    super(props);

    this.state = {
      hasCameraPermission: null,
      scanned: false,
      passed: false,
      status: '',
    }

  }

  handleBarCodeScanned = async ({ type, data }) => {
    
    this.setState({
      status: '',
    });
    
    /*
    hardcoding this is ok since the only point of 
    encryping the QR code is to deter easy recovery 
    of the private key based on an image of the QR code 
    keycard
    */

    const password = 'elliptic31415926newAES';

    var bytes = forge.util.hexToBytes(data);
    var cipherText = forge.util.createBuffer(bytes, 'raw');

    var salt = cipherText.getBytes(8);
    var keySize = 32;
    var ivSize = 16;

    var derivedBytes = forge.pbe.opensslDeriveBytes(password, salt, keySize + ivSize);
    var buffer = forge.util.createBuffer(derivedBytes);
    var key = buffer.getBytes(keySize);
    var iv = buffer.getBytes(ivSize);

    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(cipherText);
    decipher.finish();

    try{

      var decodedQR = forge.util.decodeUtf8(decipher.output);
      
      if( decodedQR.substring(0, 8) === 'blockdoc' ) {

        var VERSION = decodedQR.substring(9, 13);
        var UUID = decodedQR.substring(14, 30);
        var ECC_PRIV_KEY = decodedQR.substring(31);
  
        //if (__DEV__) console.log('The QR code version is:', VERSION);
        //if (__DEV__) console.log('The UUID is:', UUID);
        //if (__DEV__) console.log('The ECC private key is:', ECC_PRIV_KEY);
  
        let newAccount = {
          timestamp: (new Date()).getTime(),
          UUID,
          QRversion: VERSION,
          QRfullcode: data,
          eccPrivKey: ECC_PRIV_KEY,
          loading: false,
        };
  
        //wipe any old one just in case
        //the scanner should only ever be called 
        //when there is no account in the first place
        SecureStore.deleteItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(() => {}).catch(() => {});
  
        //save to local secure storage
        SecureStore.setItemAsync(SECURE_STORAGE_USER_ACCOUNT, JSON.stringify(newAccount));
  
        //circulate props to everyone else
        this.props.dispatch(setAccount(newAccount));
        //at this point, there is a UUID availible to all etc.

        //this one allows the user to move forward to the login step
        this.props.onScanSuccess({UUID});

      } else {
  
        //if (__DEV__) console.log('please go away');
        this.setState({
          scanned: true,
          status: i18n.t('code_detect_fail'),
        });
  
      }
    }
    catch{
      this.setState({
      scanned: true,
      status: i18n.t('code_detect_fail'),
    });}
  };

handleBarCodeScannedSim = () => {

let dataStringFromQRCodeScan = 'fba1b3c7564745b9284e7dfc73cf\
136dd4ee9d7931c934690b7d7efb439935ae2897730316ac44816187d0d66299\
70f49c72b528bc7e8e4a8519555da095326be635dfba5eee3131ad82e25113a1\
1bd8679441e9962f6a8c881db713d874bc78bef72e7532fd7e45';



    const password = 'elliptic31415926newAES';

    var bytes = forge.util.hexToBytes(dataStringFromQRCodeScan);
    var cipherText = forge.util.createBuffer(bytes, 'raw');

    var salt = cipherText.getBytes(8);
    var keySize = 32;
    var ivSize = 16;

    var derivedBytes = forge.pbe.opensslDeriveBytes(password, salt, keySize + ivSize);
    var buffer = forge.util.createBuffer(derivedBytes);
    var key = buffer.getBytes(keySize);
    var iv = buffer.getBytes(ivSize);

    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(cipherText);
    decipher.finish();

    try {
      var decodedQR = forge.util.decodeUtf8(decipher.output);
      console.log(decodedQR);
    } 
    catch {
      colsole.log('CodeScannerScreen: QR code error');
    }


/*

fba1b3c7564745b9284e7dfc73cf136dd4ee9d7931c934690b7d7efb439935ae2897730316ac44816187d0d6629970f49c72b528bc7e8e4a8519555da095326be635dfba5eee3131ad82e25113a11bd8679441e9962f6a8c881db713d874bc78bef72e7532fd7e45
blockdoc_v001_f4a86a1a1515fa48_9c1616229f6984165463cdba68480da4643f7885334de15dd729877434710fe7

*/
    var decodedQR = 'blockdoc_v001_dd5ff46f70aed2ee_7528f4951c651095b016ffa124fb88f3f8bb397523bed842ecc02d10c699e439';
    var VERSION = decodedQR.substring(9, 13);
    var UUID = decodedQR.substring(14, 30);
    var ECC_PRIV_KEY = decodedQR.substring(31);
  
    let newAccount = {
      timestamp: (new Date()).getTime(),
      UUID,
      QRversion: VERSION,
      QRfullcode: decodedQR,
      eccPrivKey: ECC_PRIV_KEY,
      loading: false,
    };
  
    //wipe any old one just in case
    //the scanner should only ever be called 
    //when there is no account in the first place
    SecureStore.deleteItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(() => {}).catch(() => {});
  
    //save to local secure storage
    SecureStore.setItemAsync(SECURE_STORAGE_USER_ACCOUNT, JSON.stringify(newAccount));
  
    //circulate props to everyone else
    this.props.dispatch(setAccount(newAccount));
    //at this point, there is a UUID availible to all etc.

    //this one allows the user to move forward to the login step
    this.props.onScanSuccess({UUID});

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  topLogo: {
    alignItems: 'center',
    width: 70,
    height: 70,
  },
  titleText: {
    alignItems: 'center',
    fontWeight: 'bold', 
    fontSize: 40,
  },
  scanContainer: {
    alignItems: 'center',
  },
  scannerContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    width: 260,
    height: 260,
    marginBottom: 30,
    borderWidth: 5,
    borderStyle: 'solid',
  },
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(CodeScannerScreen);
