import * as React from 'react';
import { connect } from 'react-redux';

import { Text, View, StyleSheet, Button, Image, Platform } from 'react-native';
import { Constants, Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SecureStore from 'expo-secure-store';

import BasicButton from '../components/BasicButton';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';
import mS from '../constants/masterStyle';

import forge from 'node-forge';
import * as Localization from 'expo-localization';

import { SECURE_STORAGE_USER_ACCOUNT } from '../redux/constants';

//redux
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

  async UNSAFE_componentWillMount() {

    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  
  }

  signup_DB = async (uuid) => {

    const { dispatch } = this.props;
    
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    
    const userData = {
      uuid,
    };

    //get the language here
    userData.language = Localization.locale;
    if (__DEV__) console.log(userData.language)

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(
        Permissions.NOTIFICATIONS
      );
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      dispatch(signupUser_DB(userData));
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    userData.device_token = token;

    //this sends data to the remote database
    dispatch(signupUser_DB(userData));
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

        //The order of these calls matters!
        //this transmits language and device token
        this.signup_DB(UUID);
        //NOTE - IF THIS CALL FAILS, then there will be no notifications for this user, ever
        //Should make this more fault tolerant

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

    this.setState({
      status: '',
    });

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

    //The order of these calls matters!
    //this transmits language and device token
    this.signup_DB(UUID);
    //NOTE - IF THIS CALL FAILS, then there will be no notifications for this user, ever
    //Should make this more fault tolerant

    //this one allows the user to move forward to the login step
    this.props.onScanSuccess({UUID});

  };

  render() {
    
    const { hasCameraPermission, scanned, passed, status } = this.state;
    
    let simulator = false; //true;

    let statusColor = styles.scannerBorderColor;
    
    if (scanned) {
      statusColor = passed ? styles.successBorderColor : styles.errorBorderColor;
    }

    return (

      <View style={mS.containerCenter}>
        
        <View style={[styles.scannerContainer, statusColor]}>
          {hasCameraPermission === null && <Text>{i18n.t('code_request_camera')}</Text>}
          {hasCameraPermission === false && <Text>{i18n.t('code_no_access')}</Text>}
          {!!hasCameraPermission && !simulator &&
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
              style={Platform.OS === 'ios' ? StyleSheet.absoluteFillObject : { height: 600, width: 600, alignSelf: 'center'}}
            />
          }
          {!!hasCameraPermission && simulator &&
            <BasicButton 
              text={SimScan} 
              onClick={() => { this.handleBarCodeScannedSim() }} 
            />
          }
        </View>
        
        <View style={mS.msgBoxVP}>
          <Text style={mS.titleTextVP}>{i18n.t('code_please_scan')}</Text>
          <Text style={mS.tagTextVP}>{status}</Text>
        </View>

        {!scanned && <View style={{height: 42}}/>}
        {scanned && passed && <View style={{height: 42}}/>}
        {scanned && !passed && <BasicButton 
            text={i18n.t('code_tap_to_scan')} 
            onClick={() => { this.setState({ scanned: false }); }} 
          />
        }

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
  tagText: {
    alignItems: 'center',
    fontWeight: 'normal',
    marginTop: 15, 
    fontSize: 20,
  },
  smallTagText: {
    alignItems: 'center',
    fontWeight: 'normal',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'center',
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
  scannerBorderColor: {
    borderColor: '#000000',
  },
  successBorderColor: {
    borderColor: colors.green,
  },
  errorBorderColor: {
    borderColor: colors.red,
  },
  slider: {
    display: 'flex',
    marginBottom: 15,
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: colors.lightGray,
  },
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(CodeScannerScreen);
