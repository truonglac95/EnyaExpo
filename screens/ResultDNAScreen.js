import React from 'react';
import { connect } from 'react-redux';

import { StyleSheet, Text, View, Dimensions, ActivityIndicator, Platform } from 'react-native';

import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import colors from '../constants/Colors';
import i18n from '../constants/Strings';
import mS from '../constants/masterStyle';

import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import Ionicons from 'react-native-vector-icons/Ionicons';

//files
import PDFReader from 'rn-pdf-reader-js';
const pdfStore = `${FileSystem.documentDirectory}User/PDFs`;

//storage
import { SECURE_STORAGE_USER_RESULT } from '../redux/constants';
import { 
  circulateLocalResults,
  setResultDownloadFlag,
  calculateRiskLabel,
} from '../redux/actions';

//crypto
var forge = require('node-forge');
var ecies = require('../components/ECIES.js');
var Buffer = require('buffer/').Buffer;
var decrypted64 = null;

/* 
r_state == 0 -> User is in database - this entry is generated right after whitelist
r_state == 1 -> Sample received
r_state == 2 -> Sequencing in progress
r_state == 3 -> Analyzing your genome 
r_state == 4 -> Initial Result done - please download -> and the app sets this to state 8 after successful download.
r_state == 5 -> Updated Result done - please download -> and the app sets this to state 8 after successful download.
r_state == 8 -> This result was already downloaded
*/

class ResultDNAScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (
        <Text 
          style={{
            fontSize: 19,
            color: colors.headerFontColor,
            fontFamily: colors.headerFont,
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
            alignSelf: 'center',
          }}>
            {i18n.t('result_DNA_title')}
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
      cryptoState: 'initial',
      progress: 0,
      isMounted: false,
    };

  }

  componentWillUnmount() {

    this.state.isMounted = false;

  }

  async componentDidMount() {

    const { account } = this.props.user.account;
    
    //clear the notifications badge because user 
    //clicked the check results button as intended
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    
    if (status === 'granted') {
      if ( Platform.OS === 'ios' ) {
        if (__DEV__) console.log('Clearing notification badge in iOS')
        Notifications.setBadgeNumberAsync( 0 );
      }
      else if ( Platform.OS === 'android' ) {
        if (__DEV__) console.log('Clearing notification badge in Android')
        //????????????????????????????????
      }
    }

    this.setState({
      isMounted: true,
    }, () => {

      //for testing 
      //SecureStore.deleteItemAsync(SECURE_STORAGE_USER_RESULT).then(() => {}).catch(() => {});

      SecureStore.getItemAsync(SECURE_STORAGE_USER_RESULT).then(result => {
        if (__DEV__) console.log('ResultsDNA: Local keys/results check.')
        //if (__DEV__) console.log(result);
        if (result) {
          if (__DEV__) console.log('ResultsDNA: Local keys/results found.')
          const localResult = result ? JSON.parse(result) : {};
          //if (__DEV__) console.log(localResult)
          this.props.dispatch(circulateLocalResults(localResult));
          //check for overall results status
          //this call right here is sort of important 
          //this triggers everything else
          this.updateResultsStatus();
        } else {
          if (__DEV__) console.log('ResultsDNA: No local keys/results found.')
          //check for overall results status
          //in this case, we might be toast, or we might be able to get result from servers,
          //if we can access those servers AND if the sequencing is done
          this.updateResultsStatus();
        }
      }).catch(err => {
        //something really weird just happened
        //do not signinTokenGen 
      });
    });
  };

  isFile(r_state) {
    if (r_state === 4) {
      return true
    } else if ( r_state === 5 ) {
      return true
    } else {
      return false
    }
  }

  updateResultsStatus = () => {

    //the goal of this function is to figure out what is going on,
    //results-wise. there are many many different scenarios
    //this is all based on analyzing the results array

    const { localResult, error } = this.props.result;
    const { account } = this.props.user;

    //if (__DEV__) console.log('ResultsDNA: updateResultsStatus:')
    //if (__DEV__) console.log(localResult)
    //if (__DEV__) console.log(error)
    //if (__DEV__) console.log(account)

    let can_reach_api = true;
    let hacker = false;

    if( error !== null ){
      if (__DEV__) console.log('ResultsDNA: We have an error:', error)
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
    first major waypoint - do we have local result and can 
    we access the blockdoc servers?
    If neither is true, we are not having a great day.
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
      if(localResult.r_state === 0) {
        if (__DEV__) console.log('ResultsDNA: User in database - waiting for sample')
        this.setState({cryptoState: 'userInDB'});
      } else if(localResult.r_state === 1) {
        if (__DEV__) console.log('ResultsDNA: Sample on way to lab')
        this.setState({cryptoState: 'sampleInTransit'});
      } else if (localResult.r_state === 2) {
        if (__DEV__) console.log('ResultsDNA: Sequencing in progress')
        this.setState({cryptoState: 'seqInProgress'});
      } else if (localResult.r_state === 3) {
        if (__DEV__) console.log('ResultsDNA: Analyzing your genome')
        this.setState({cryptoState: 'analyzing'});
      } else if (this.isFile( localResult.r_state )) {
        if (__DEV__) console.log('ResultsDNA: Decrypting local')
        this.setState({cryptoState: 'decrypting'});
        this.prepareToDecryptLocalPDF(); 
      }
    }

  }

  async prepareToDecryptLocalPDF() {

    const { localResult } = this.props.result;
    const { account } = this.props.user;

    //const { frs } = this.props.answer;
    //const { answers } = this.props.answer;
    //if (__DEV__) console.log("Account:", account);
    //if (__DEV__) console.log("localResult:", localResult);

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

    //if (__DEV__) console.log("keyPayload bytes:", keyPayload);

    var passwordECIES = await ecies.decrypt(privateKey, keyPayload);
    //this gives an ecies buffer
    //if (__DEV__) console.log("ResultsDNA password 1:", passwordECIES);
    var passwordHex = passwordECIES.toString();
    //now we have a HEX string
    //if (__DEV__) console.log("ResultsDNA password 2:", passwordHex);
    var passwordForge = forge.util.hexToBytes(passwordHex);
    //now we have a forge datastructure

    //if (__DEV__) console.log('trying to read this file:')
    //if (__DEV__) console.log(localResult.ENresultPDF);

    if (this.state.isMounted) {
      this.setState({cryptoState: 'decrypting', progress: 0});
      FileSystem.readAsStringAsync(
        localResult.ENresultPDF, 
        { encoding: FileSystem.EncodingType.Base64 }
      ).then((encrypted64) => {
        if (this.state.isMounted) {
          this.setState({cryptoState: 'decrypting', progress: 10});
          this.decryptFileAndDisplayIt(encrypted64, passwordForge);
        }
      });
    }

  }

  async decryptFileAndDisplayIt( encrypted64, password ) {

    //if (__DEV__) console.log("CRYPTO encrypted pdf:", encrypted64.substr(0,40));
    //if (__DEV__) console.log("CRYPTO password DFDI:", password);
    
    var encrypted = forge.util.decode64(encrypted64);
    //if (__DEV__) console.log("CRYPTO encrypted pdf non-64:\n", encrypted.substr(0,400));
    
    var input = forge.util.createBuffer(encrypted);

    if (this.state.isMounted) {
      this.setState({cryptoState: 'decrypting', progress: 40});
    }

    var salt = input.getBytes(8);
    //if (__DEV__) console.log("CRYPTO salt:", salt);

    var derivedBytes = forge.pbe.opensslDeriveBytes(password, salt, 48);
    var buffer = forge.util.createBuffer(derivedBytes);
    //if (__DEV__) console.log(buffer.toHex());

    var key = buffer.getBytes(32);
    var iv = buffer.getBytes(16);

    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    
    decipher.start({iv: iv});

    decipher.update(input);

    if (this.state.isMounted) {
      this.setState({cryptoState: 'decrypting', progress: 60});
    }

    var decrypted = decipher.output.getBytes();
    
    //if (__DEV__) console.log("CRYPTO decrypted pdf:\n", decrypted.toString().substr(0,100));
    //if (__DEV__) console.log("CRYPTO decrypted pdf:", decrypted.toString());

    decrypted64 = forge.util.encode64(decrypted);

    if (__DEV__) console.log("CRYPTO decrypted pdf in base64 should be:\nJVBERi0xL");
    if (__DEV__) console.log("CRYPTO decrypted pdf in base64 actual:\n"+ decrypted64.substr(0,9));

    if (decipher.finish()) {

      if (__DEV__) console.log('CRYPTO: Decipher ops just completed');
      
      if (this.state.isMounted) {

        //this.setState({cryptoState: 'decrypting', progress: 100});

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
    
    const { base64String, cryptoState, progress } = this.state;

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

{/*nothing found - this is when the internet is blocked*/}
{(cryptoState === 'nothing') && 
  <View style={styles.row}>
    <Text style={mS.mediumDarkFP}>{i18n.t('result_null')}</Text>
    <Text style={mS.smallGrayFP}>{i18n.t('result_null_exp')}</Text>
  </View>
}
{/*Status: checking... - this when we are trying to figure out what is going on*/}
{(cryptoState === 'initial') && 
  <View style={styles.row}>
    <Text style={mS.mediumDarkFP}>{i18n.t('result_checking')}</Text>
    <Text style={mS.smallGrayFP}>{i18n.t('result_wait')}</Text>
  </View>
}
{/*security issue - they need to contact us to reset their account*/}
{(cryptoState === 'hacker') && 
  <View style={styles.row}>
    <Text style={mS.mediumDarkFP}>{i18n.t('result_hacker')}</Text>
  </View>
}
{/*waiting for samples - this is state zero*/}
{(cryptoState === 'userInDB') && 
  <View style={styles.row}>
    <Text style={mS.mediumDarkFP}>{i18n.t('result_userInDB')}</Text>
  </View>
}
{/*samples in transit - state 1 */}
{(cryptoState === 'sampleInTransit') && 
  <View style={styles.row}>
    <Text style={mS.mediumDarkFP}>{i18n.t('result_transit')}</Text>
  </View>
}
{/*genotyping in progress - state 2 */}
{(cryptoState === 'seqInProgress') && 
  <View style={styles.row}>
    <Text style={mS.mediumDarkFP}>{i18n.t('result_sequencing')}</Text>
  </View>
}
{/*analyzing - state 3 */}
{(cryptoState === 'analyzing') && 
  <View style={styles.row}>
    <Text style={mS.mediumDarkFP}>{i18n.t('result_analysis')}</Text>
  </View>
}
{(cryptoState === 'downloading') && 
  <View style={styles.row}>
    <Text style={mS.mediumDarkFP}>{i18n.t('result_download')}</Text>
    <Text style={mS.smallGrayFP}>{i18n.t('result_wait_download')}</Text>
  </View>
}
{(cryptoState === 'decrypting') && 
  <View style={styles.row}>
    <Text style={mS.mediumDarkFP}>{i18n.t('result_decrypt')}</Text>
    <Text style={mS.smallGrayFP}>{i18n.t('result_wait_decrypt')}</Text>
  </View>
}
{(cryptoState === 'display') && 
  <View style={styles.pdfReader}>
    <PDFReader
      source={{base64: base64String}}
    />
  </View>
}
{cryptoState === 'decrypting' && 
  <View style={[styles.containerProgress]}>
    <ActivityIndicator size="large" color='#33337F' />
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

export default connect(mapStateToProps)(ResultDNAScreen);