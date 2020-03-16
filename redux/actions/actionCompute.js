import {
  //scoring
  GET_SC_SUCCESS,
  SECURE_COMPUTE,
  SECURE_COMPUTE_SMC,
  SECURE_COMPUTE_FHE_S,
  SECURE_COMPUTE_FHE_B,
  SECURE_COMPUTE_SUCCESS,
  SECURE_COMPUTE_FAILURE,
  SECURE_COMPUTE_PROGRESS,
  SECURE_COMPUTE_INVALIDATE,
  //stored answers
  SECURE_STORAGE_SC,
  SECURE_STORAGE_ANSWERS,
  SECURE_STORAGE_ACCOUNT,
} from '../constants';

import EnyaSMC from 'enyasmc'
import EnyaFHE from 'enyafhe'

import * as SecureStore from 'expo-secure-store'
import * as  forge from 'node-forge';
import { AsyncStorage } from 'react-native';

const sc = {
  haveSC: false,
  result: 0.0,
  current: false,
  computing: false
};

const CanCompute = function ( data ) {

  var ga = 0; //ga is short for 'good answers'
  
  if ( data.country > 0 ) ga += 1
  if ( data.birthyear > 0 ) ga += 1
  if ( data.gender > 0 ) ga += 1
  if ( data.height > 0 ) ga += 1
  if ( data.weight > 0 ) ga += 1
  if ( data.binary_1 > 0 ) ga += 1
  if ( data.binary_2 > 0 ) ga += 1

  if( ga >= 7 ) {
    return true; //yes we have all the info we need
  } else {
    return false; //not enough data
  }
}

const Clean = function ( data ) {

  var dataR = {};
  dataR.birthyear = data.birthyear;
  dataR.gender = data.gender;
  dataR.height = data.height;
  dataR.weight = data.weight;
  dataR.binary_1 = data.binary_1;
  dataR.binary_2 = data.binary_2;
  dataR.country = data.country;
  return dataR;

}

export const secureComputeBegin = () => ({ type: SECURE_COMPUTE });
export const secureComputeSuccess = (data) => ({ type: SECURE_COMPUTE_SUCCESS, payload: data  });
export const secureComputeFailure = (error) => ({ type: SECURE_COMPUTE_FAILURE, payload: error });
export const secureComputeProgress = (data) => ({ type: SECURE_COMPUTE_PROGRESS, payload: data });
export const secureComputeInvalidate = () => ({ type: SECURE_COMPUTE_INVALIDATE });

export const secureComputeSMC = (data) => async (dispatch) => {

  dispatch( secureComputeBegin() );
  dispatch( secureComputeProgress({computing:true}))

  var result = 0.0;
  var haveSC = false;
  var current = false;
  var error = null;

  if ( CanCompute( data ) ) {

    var dataC = Clean( data )

    //----------- Provide data ---------------------------
    EnyaSMC.input(Object.values(dataC))

    //----------- Configure ------------------------------
    EnyaSMC.configure({
      CLIENT_TOKEN: "f7edB8a8A4D7dff85d2CB7E5",
      algo_name: "sample_algo"
    })

    //----------- Run the model --------------------------
    const model = await EnyaSMC.SMC()
    
    //------------Make sense of return -------------------
    if(model.status_code == 200) {
      result = parseFloat(model.secure_result).toFixed(2);
      current = true; //because we just recomputed
      haveSC = true; //yes, we have result
    } else {
      error = model.status_code;
    }
    dispatch( secureComputeProgress({computing:false}) )
  } else {
    if (__DEV__) console.log('Not enough data for secure computation');
  }

  SecureStore.getItemAsync(SECURE_STORAGE_SC).then(res => {
    const sc = res ? JSON.parse(res) : {};
    let updatedSC = {...sc,result,haveSC,current,error};
    SecureStore.setItemAsync(SECURE_STORAGE_SC, JSON.stringify(updatedSC));
    if (!error) dispatch(secureComputeSuccess(updatedSC))
    else dispatch(secureComputeFailure({error}))
  })

}

export const secureComputeFHESimple = (data) => async (dispatch) => {

  dispatch( secureComputeBegin() );
  dispatch( secureComputeProgress({computing: true}));

  var result = 0.0;
  var haveSC = false;
  var current = false;
  var error = null;

  if ( CanCompute( data ) ) {

    if (__DEV__) console.log('Yes, there are enough data for FHE Simple computation');

    var dataC = Clean( data )

    EnyaFHE.configure({
      CLIENT_TOKEN: "f7edB8a8A4D7dff85d2CB7E5",
      algo_name: "sample_algo"
    })

    const model = await EnyaFHE.FHE(Object.values(dataC));

    result = (model / 100000).toFixed(2);
    current = true; //because we just recomputed it
    haveSC = true; //yes, we have result

    /* Boyuan - can you have a look?
    //------------Make sense of return -------------------
    if(model.status_code == 200) {
      result = parseFloat(model.secure_result).toFixed(2);
      current = true; //because we just recomputed
      haveSC = true; //yes, we have result
    } else {
      error = model.status_code;
    }
    */

    dispatch( secureComputeProgress({computing:false}) )
  } else {
    if (__DEV__) console.log('Not enough data for secure computation');
  }

  SecureStore.getItemAsync(SECURE_STORAGE_SC).then(res => {
    const sc = res ? JSON.parse(res) : {};
    let updatedSC = {...sc,result,haveSC,current,error};
    SecureStore.setItemAsync(SECURE_STORAGE_SC, JSON.stringify(updatedSC));
    if (!error) dispatch(secureComputeSuccess(updatedSC))
    else dispatch(secureComputeFailure({error}))
  })

}

export const secureComputeFHEBuffered = (data) => async (dispatch) => {

  dispatch( secureComputeBegin() );
  dispatch( secureComputeProgress({computing: true}));

  var result = 0.0;
  var haveSC = false;
  var current = false;
  var error = null;

  if ( CanCompute( data ) ) {

    var dataC = Clean( data )

    if (__DEV__) console.log('Yes, there are enough data for FHE Buffered computation');

    EnyaFHE.Configure({
      CLIENT_TOKEN: "f7edB8a8A4D7dff85d2CB7E5",
      algo_name: "sample_algo"
    })

    /* FHE fhe key id */
    var account = await SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT);
    account = account ? JSON.parse(account):{};
    var Key_id_update = account.Key_id;
    
    /* randomly pick one FHE key */
    var random_id = Key_id_update[Math.floor(Math.random()*Key_id_update.length)];
    var aes_encrypt = await AsyncStorage.getItem(random_id)
    var aes_iv_hex = aes_encrypt.slice(0,32);
    var aes_fhe_key = aes_encrypt.slice(32);
    var bytes = forge.util.hexToBytes(aes_fhe_key);
    aes_fhe_key = forge.util.createBuffer(bytes);

    /* Delete the used FHE key */
    Key_id_update = Key_id_update.filter(Key_id_update => !random_id.includes(Key_id_update))
    account.Key_id = Key_id_update;

    if ( account.Key_id.length == 0 ) {
      account.FHE_keys_ready = false;
    }

    await SecureStore.setItemAsync(SECURE_STORAGE_ACCOUNT, JSON.stringify(account));
    await AsyncStorage.removeItem(random_id)

    /* aes decrypt FHE keys */
    var aes_key = account.aes_key;
    var aes_iv = forge.util.hexToBytes(aes_iv_hex);
    var decipher = forge.cipher.createDecipher('AES-CBC', aes_key);
    decipher.start({iv: aes_iv});
    decipher.update(aes_fhe_key);
    var decipher_status = decipher.finish();
    var fhe_keys = JSON.parse(decipher.output.data);

    /* load FHE keys */
    var privatekey_fhe = fhe_keys.privatekey;
    var publickey_fhe = fhe_keys.publickey;
    var multikey_fhe = fhe_keys.multikey;
    var rotakey_fhe = fhe_keys.rotakey;

    /* Pack the weights */
    var plaintext = EnyaFHE.PackVector(Object.values(dataC));

    /* Encrypt the plaintext */
    var ciphertext_fhe = EnyaFHE.EncryptVector(
      plaintext,
      publickey_fhe,
    );
    
    /* Create JSON payload */
    var jsonpayload = EnyaFHE.JSONPayload(
      publickey_fhe,
      multikey_fhe,
      rotakey_fhe,
      ciphertext_fhe
    );
    
    /* Random String */
    var string_pcr = EnyaFHE.RandomPCR();
    if (__DEV__) console.log("EnyaFHE: Random PCR -- ", string_pcr)
    
    /* Send the payload to the server */
    var senddata = await EnyaFHE.SendData({pcr: string_pcr, data: jsonpayload})

    const return_message = await senddata.json();
    
    if (return_message.status == true) { 
      
      if (__DEV__) console.log("EnyaFHE: Sent encryption keys.");

      var status = false;
      var count = 0;

      while ((status == false) & (count < 5)) {
        await EnyaFHE.sleep(1000);
        /* Check the status of calculation */
        const checkstatus = await EnyaFHE.CheckStatus(
            { pcr: string_pcr, data: jsonpayload },
        );
        const return_message = await checkstatus.json();
        status = return_message.API_result_ready;
        count = count + 1;
      }

      if (status == true) {
        
        if (__DEV__) console.log("EnyaFHE: Calculation finished.");
        if (__DEV__) console.log("EnyaFHE: Starting to retrieve encrypted result.");
        
        /* Retrieve the calculation result */
        var getresult = await EnyaFHE.GetResult({pcr: string_pcr})
        
        const cipher_result = await getresult.json();

        if (__DEV__) console.log("EnyaFHE: Decrypting.");
        
        var ciphertext_res = EnyaFHE.ReadCiphertext(cipher_result.ciphertext);

        var text = await EnyaFHE.DecryptVector(ciphertext_res, privatekey_fhe)
        
        if (__DEV__) console.log("EnyaFHE: Finished decryption.")

        result = (text[0] / 100000).toFixed(2);
        current = true; 
        haveSC = true;

      } else {
        /* Computation failed */
        if (__DEV__) console.log("Error: ", status);
        dispatch( secureComputeProgress({computing:false}));
      }
    } else {
      /* Computation failed */
      if (__DEV__) console.log("Failed to send encryption keys");
      dispatch( secureComputeProgress({computing:false}));
    }
  } else {
    if (__DEV__) console.log('Not enough data for secure computation');
  }

  SecureStore.getItemAsync(SECURE_STORAGE_SC).then(res => {
    const sc = res ? JSON.parse(res) : {};
    let updatedSC = {...sc,result,haveSC,current,error};
    SecureStore.setItemAsync(SECURE_STORAGE_SC, JSON.stringify(updatedSC));
    if (!error) dispatch(secureComputeSuccess(updatedSC))
    else dispatch(secureComputeFailure({error}))
  })

}