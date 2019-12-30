import React from 'react';
import { connect } from 'react-redux';

import { StyleSheet, Text, View, Dimensions, ActivityIndicator, Platform } from 'react-native';

import colors from '../constants/Colors';
import mS from '../constants/masterStyle';

import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

//files
import PDFReader from 'rn-pdf-reader-js';
const pdfStore = `${FileSystem.documentDirectory}User/PDFs`;

//storage
import { SECURE_STORAGE_RESULT } from '../redux/constants';
import { circulateLocalResults } from '../redux/actions';

//crypto
var forge = require('node-forge');
var ecies = require('../EnyaSDK/ECIES.js');
var Buffer = require('buffer/').Buffer;
var decrypted64 = null;

class Report extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (
        <Text 
          style={{
            fontSize: 19,
            color: '#33337F',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
            alignSelf: 'center',
          }}>
            {'Secure Report'}
        </Text>
      ),
      headerRight: (<View></View>),
    }
  };

  constructor (props) {

    super(props);

    const { results } = this.props.result;

    this.state = {
      ENresultPDF: null,
      base64String: null,
      cryptoState: 'decrypting',
      isMounted: false,
    };

  }

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  async componentDidMount() {

    const { account } = this.props.user.account;

    this.setState({
      isMounted: true,
    }, () => {

      //for testing 
      //SecureStore.deleteItemAsync(SECURE_STORAGE_RESULT).then(() => {}).catch(() => {});

      SecureStore.getItemAsync(SECURE_STORAGE_RESULT).then(result => {
        if (__DEV__) console.log('Result: Local keys/results check.')
        if (result) {
          if (__DEV__) console.log('Result: Local keys/results found.')
          const localResult = result ? JSON.parse(result) : {};
          //if (__DEV__) console.log(localResult)
          this.props.dispatch(circulateLocalResults(localResult));
          //check for overall results status
          //this call right here is sort of important 
          //this triggers everything else
          this.updateResultsStatus();
        } else {
          if (__DEV__) console.log('Result: No local keys/results found.')
          //this should never happen since the only way to 
          //get here is if results have been downlaoded
        }
      }).catch(err => {
        //something really weird just happened
      });
    });
  };

  updateResultsStatus = () => {

    const { localResult, error } = this.props.result;
    const { account } = this.props.user;

    let can_reach_api = true;
    let hacker = false;

    if( error !== null ){
      if (__DEV__) console.log('Result: We have an error:', error)
      //What kind?
      if( error.error_type === 'network_request_failed' ) {
        can_reach_api = false;
      } else if ( error.error_type === 'security_alert' ) {
        hacker = true;
      }
    }

    let have_local_result = false;

    if( localResult && localResult.timestamp > 0 ){
      have_local_result = true;
    } else {
      have_local_result = false;
    }

    /********************************************************** 
    Integrity and security checks here... - removed for simplicity
    ***********************************************************/

    if ( !can_reach_api && !have_local_result ) {
      if (__DEV__) console.log('*****************CASE 1*********************')
      if (__DEV__) console.log('ResultsDNA: no network access')
      if (__DEV__) console.log('ResultsDNA: no local results file found')
      this.setState({cryptoState: 'nothing'});
    }
    else if ( hacker ) {
      //do nothing and display "contact support"
      if (__DEV__) console.log('***************SECURITY FLAG*****************')
      if (__DEV__) console.log('ResultsDNA: hacker')
      this.setState({cryptoState: 'hacker'});
    }
    else if ( can_reach_api && !have_local_result ) {
      //we are downloading the result
      if (__DEV__) console.log('*****************CASE 2**********************')
      if (__DEV__) console.log('ResultsDNA: downloading result')
      this.setState({cryptoState: 'downloading'});
    }
    else if ( have_local_result )
    {
      //at this point we already have a basic sense of things...
      if (__DEV__) console.log('ResultsDNA: We found a local file!')
      if (__DEV__) console.log('ResultsDNA: Decrypting local')
      this.setState({cryptoState: 'decrypting'});
      this.prepareToDecryptLocalPDF(); 
    }

  }

  async prepareToDecryptLocalPDF() {

    const { localResult } = this.props.result;
    const { account } = this.props.user;

    //these are in the QR code so we can always 
    //assume they will be available locally
    var ECC_PRIV_KEY = account.eccPrivKey; 
    //if (__DEV__) console.log("Account:", account);
    var privateKey = Buffer.from(ECC_PRIV_KEY, 'hex');
    //if (__DEV__) console.log("ECC_PRIV_KEY bytes:", privateKey);

    var keyPayload = {
      iv: Buffer.from(localResult.iv, 'hex'),
      ephemPublicKey: Buffer.from(localResult.epc, 'hex'),
      ciphertext: Buffer.from(localResult.ciphertext, 'hex'),
      mac: Buffer.from(localResult.mac, 'hex'),
    };

    var passwordECIES = await ecies.decrypt(privateKey, keyPayload);
    //if (__DEV__) console.log("ResultsDNA password 1:", passwordECIES);
    var passwordHex = passwordECIES.toString();
    //now we have a HEX string
    var passwordForge = forge.util.hexToBytes(passwordHex);
    //now we have a forge datastructure

    if (this.state.isMounted) {
      this.setState({cryptoState: 'decrypting', progress: 0});
      FileSystem.readAsStringAsync(
        localResult.ENresultPDF, 
        { encoding: FileSystem.EncodingType.Base64 }
      ).then((encrypted64) => {
        if (this.state.isMounted) {
          this.setState({cryptoState: 'decrypting'});
          this.decryptFileAndDisplayIt(encrypted64, passwordForge);
        }
      });
    }

  }

  async decryptFileAndDisplayIt( encrypted64, password ) {

    var encrypted = forge.util.decode64(encrypted64);
    var input = forge.util.createBuffer(encrypted);

    var salt = input.getBytes(8);
    var derivedBytes = forge.pbe.opensslDeriveBytes(password, salt, 48);
    var buffer = forge.util.createBuffer(derivedBytes);

    var key = buffer.getBytes(32);
    var iv = buffer.getBytes(16);

    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    
    decipher.start({iv: iv});
    decipher.update(input);
    
    var decrypted = decipher.output.getBytes();

    decrypted64 = forge.util.encode64(decrypted);

    if (__DEV__) console.log("CRYPTO decrypted pdf in base64 should be:\nJVBERi0xL");
    if (__DEV__) console.log("CRYPTO decrypted pdf in base64 actual:\n"+ decrypted64.substr(0,9));

    if (decipher.finish()) {

      if (__DEV__) console.log('CRYPTO: Decipher ops just completed');
      
      if (this.state.isMounted) {

        this.setState({
          base64String: 'data:application/pdf;base64,' + decrypted64,
          cryptoState: 'display', //all good - please display this string
        });

      }

    } else {
      if (__DEV__) console.log('CRYPTO: Decipher ops did not complete');
    };

  }
  
  render() {
    
    const { base64String, cryptoState } = this.state;

    //this will be mostly zero - except when file has been decrypted and is availible. 
    if(base64String != null) {
      if (__DEV__) console.log('CHECK ME:', base64String.substr(0,37));
      if (__DEV__) console.log('This needs to start with = data:application/pdf;base64,JVBERi0xL');
      if(base64String.substr(0,37)==='data:application/pdf;base64,JVBERi0xL'){
        if (__DEV__) console.log('******************************************************');
        if (__DEV__) console.log('base64 string integrity check passed! Decrypted correctly and ready to display');
        if (__DEV__) console.log('******************************************************');
      }
    }

    if (__DEV__) console.log( 'ResultsDNA render:', cryptoState );

    return (

<View>
<View>

{(cryptoState === 'decrypting') && 
<View>
  <View style={styles.row}>
    <Text style={mS.mediumDarkFP}>{'Decrypting Report'}</Text>
    <Text style={mS.smallGrayFP}>{'Please wait...'}</Text>
  </View>
  <View style={[styles.containerProgress]}>
    <ActivityIndicator size="large" color='#33337F' />
  </View>
</View>
}
{(cryptoState === 'display') && 
  <View style={styles.pdfReader}>
    <PDFReader
      source={{base64: base64String}}
    />
  </View>
}

</View></View>);}}

const styles = StyleSheet.create({
  containerProgress: {
    marginTop: 300,
    marginLeft: 50,
    marginRight: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfReader: {
    position: 'absolute',
    left: 0,
    top: -10,
    width: '100%',
    height: (Platform.OS === 'android') ? Dimensions.get('window').height - 95 : Dimensions.get('window').height - 100,
  },
  row: {
    position: 'absolute',
    left: 0,
    top: 100,
    margin: 20,
  },
});

const mapStateToProps = state => ({
  user: state.user,
  result: state.result,
  answer: state.answer,
});

export default connect(mapStateToProps)(Report);