import {
  //basic ops
  GET_ANSWERS,
  GET_ANSWERS_SUCCESS,
  GET_ANSWERS_FAILURE,
  GIVE_ANSWER,
  GIVE_ANSWER_SUCCESS,
  GIVE_ANSWER_FAILURE,
  //scoring
  GET_SMC_SUCCESS,
  SECURE_COMPUTE,
  SECURE_COMPUTE_SUCCESS,
  SECURE_COMPUTE_FAILURE,
  SECURE_COMPUTE_PROGRESS,
  //stored answers
  SECURE_STORAGE_SMC,
  SECURE_STORAGE_ANSWERS,
  SECURE_STORAGE_ACCOUNT,
} from '../constants';

import EnyaSMC from 'enyasmc'
import EnyaFHE from 'enyafhe'

import * as SecureStore from 'expo-secure-store'

import * as  forge from 'node-forge';
import { AsyncStorage } from 'react-native';

export const getAnswersBegin   = data  => ({ type: GET_ANSWERS });
export const getAnswersSuccess = data  => ({ type: GET_ANSWERS_SUCCESS, payload: data });
export const getAnswersFailure = error => ({ type: GET_ANSWERS_FAILURE, payload: error });

export const giveAnswerBegin   = data  => ({ type: GIVE_ANSWER });
export const giveAnswerSuccess = data  => ({ type: GIVE_ANSWER_SUCCESS, payload: data });
export const giveAnswerFailure = error => ({ type: GIVE_ANSWER_FAILURE, payload: error });

export const get_SMC_Success   = data  => ({ type: GET_SMC_SUCCESS,     payload: data });

const answers = {
  birthyear: 0,
  weight: 0,
  height: 0,
  country: 0,
  gender: 0,
  binary_1: 0,
  binary_2: 0,
}

const smc = {
  percentAnswered: 0,
  numberAnswered: 0,
  haveSMC: false,
  result: 0.0,
  current: false,
};

const CanCompute = function ( data ) {

  var ga = 0; //ga is short for 'good answers'
  
  if ( data.birthyear > 0 ) { ga += 1; }
  if ( data.gender > 0 ) { ga += 1; }
  if ( data.height > 0 ) { ga += 1; }
  if ( data.weight > 0 ) { ga += 1; }
  if ( data.binary_1 > 0 ) { ga += 1; }
  if ( data.binary_2 > 0 ) { ga += 1; }

  if( ga >= 6 ) {
    return true; //yes we have all the info we need
  } else {
    return false; //not enough data
  }
}

const NumGoodAnswers = function ( data ) {

  var ga = 0;
  
  if ( data.birthyear > 0 ) { ga += 1; }
  if ( data.gender > 0 ) { ga += 1; }
  if ( data.height > 0 ) { ga += 1; }
  if ( data.weight > 0 ) { ga += 1; }
  if ( data.binary_1 > 0 ) { ga += 1; }
  if ( data.binary_2 > 0 ) { ga += 1; }
  if ( data.country > 0 ) { ga += 1; }

  return ga;
}


export const getAnswers = () => (dispatch) => {

  dispatch(getAnswersBegin());

  SecureStore.getItemAsync(SECURE_STORAGE_ANSWERS).then(result => {
    if (result) {
        if (__DEV__) console.log('Answers: Previous answers found.');
        const data = JSON.parse(result);
        dispatch(getAnswersSuccess(data));
      } else {
        //create the file structure
        if (__DEV__) console.log('Answers: No previous answers found.');
        SecureStore.setItemAsync(SECURE_STORAGE_ANSWERS, JSON.stringify(answers));
      }
    }).catch(err => {
      if (__DEV__) console.log(err);
    });

  SecureStore.getItemAsync(SECURE_STORAGE_SMC).then(result => {
    if (result) {
        if (__DEV__) console.log('Answers: SMC results found.');
        const data = JSON.parse(result);
        dispatch(get_SMC_Success(data));
      } else {
        //create the file structure
        if (__DEV__) console.log('Answers: No SMC results found.');
        SecureStore.setItemAsync(SECURE_STORAGE_SMC, JSON.stringify(smc));
      }
    }).catch(err => {
      if (__DEV__) console.log(err);
    });

}

export const giveAnswer = (answer) => (dispatch) => {

  dispatch(giveAnswerBegin());

  SecureStore.getItemAsync(SECURE_STORAGE_ANSWERS).then(res1 => {
    
    if (res1) {

      let data = JSON.parse(res1);

      answer.forEach(ans => {data[ans.question_id] = ans.answer});

      let updatedData = { ...data };

      SecureStore.setItemAsync(SECURE_STORAGE_ANSWERS, JSON.stringify(updatedData));

      dispatch( giveAnswerSuccess(updatedData) );

      var numberAnswered = NumGoodAnswers( data );
      var current = false; //because we just received a new answer from the user
      var percentAnswered = 0;

      if( numberAnswered > 0 ) {
        percentAnswered = Math.round((numberAnswered / 7.0) * 100);
      }

      SecureStore.getItemAsync(SECURE_STORAGE_SMC).then(res2 => {

        if (res2) {
          
          let smc = JSON.parse(res2);

          let updatedSMC = {
            ...smc,
            percentAnswered,
            numberAnswered,
            current,
          };

          SecureStore.setItemAsync(SECURE_STORAGE_SMC, JSON.stringify(updatedSMC));
          
          dispatch( get_SMC_Success(updatedSMC) );
          
        };
      });
    }; //close if(res1)
  }); //close ss_answers

};

export const secureComputeBegin = () => ({
  type: SECURE_COMPUTE
});

export const secureComputeSuccess = (data) => ({
  type: SECURE_COMPUTE_SUCCESS,
  payload: data,
});

export const secureComputeFailure = (error) => ({
  type: SECURE_COMPUTE_FAILURE,
  payload: error,
});

export const secureComputeProgress = (data) => ({
  type: SECURE_COMPUTE_PROGRESS,
  payload: data,
});

export const FHEKeyGen = () => async(dispatch) => {

  //how many fresh keys do we have right now?
  var account = await SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT)
  account = account ? JSON.parse(account) : {};
  var key_number = account.Key_id.length;

  dispatch(secureComputeProgress({
    FHE_key_progress: 5,
    FHE_key_inventory: key_number,
    FHE_key_statusMSG: 'Preparing to compute keys...\n'
  }))

  while ( key_number < 3 ) {

    //update key_number
    account = await SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT)
    account = account ? JSON.parse(account) : {};
    key_number = account.Key_id.length;

    //update key generation process, prevent from
    //running multiple key gen process
    account.FHE_indicator = true;
    await SecureStore.setItemAsync(SECURE_STORAGE_ACCOUNT, JSON.stringify(account))

    dispatch( secureComputeProgress({
      FHE_key_progress: 10,
      FHE_key_inventory: key_number,
      FHE_key_statusMSG: 'Computing private key...\n'
    }))

    //generate new key
    var rand_key_id = Math.random().toString(36).substring(2, 5) + 
      Math.random().toString(36).substring(2, 5);
        
    /* Generate private key */
    var privatekey = await EnyaFHE.PrivateKeyGenRN()
      
    dispatch( secureComputeProgress({
      FHE_key_progress: 20,
      FHE_key_inventory: key_number,
      FHE_key_statusMSG: 'Generated private key.\nComputing public key...\n'
    }))

    /* Generate public key */
    var publickey =  await EnyaFHE.PublicKeyGenRN(privatekey);

    dispatch( secureComputeProgress({
      FHE_key_progress: 50,
      FHE_key_inventory: key_number,
      FHE_key_statusMSG: 'Generated public key.\nComputing multiplication key...\n'
    }))

    /* Generate multi key */
    var multikey = await EnyaFHE.MultiKeyGenRN(privatekey);
   
    dispatch( secureComputeProgress({
      FHE_key_progress: 75,
      FHE_key_inventory: key_number,
      FHE_key_statusMSG: 'Generated multiplication key.\nComputing rotation key...\n'
    }))

    /* Generate rotation key */
    var rotakey = await EnyaFHE.RotaKeyGenRN(privatekey);

    dispatch( secureComputeProgress({
      FHE_key_progress: 100,
      FHE_key_inventory: key_number,
      FHE_key_statusMSG: 'Generated rotation key.\nKeyGen complete.\n'
    }))

      var key = {
        privatekey: privatekey,
        publickey: publickey, 
        multikey: multikey, 
        rotakey: rotakey
      }

      /* 
      Prevent use of the old AES key if the user deletes their account and generates a new AES key.
      */
      
      //var account = await SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT);
      //account = JSON.parse(account);

      /* AES encrypt the FHE keys */
      var aes_key = account.aes_key;
      var aes_iv = forge.random.getBytesSync(16);
      var aes_iv_hex = forge.util.bytesToHex(aes_iv);
      
      var cipher = forge.cipher.createCipher('AES-CBC', aes_key);
      cipher.start({iv: aes_iv});
      cipher.update(forge.util.createBuffer(JSON.stringify(key),'utf8'));
      cipher.finish();

      var encrypted = cipher.output;
      encrypted = aes_iv_hex + encrypted.toHex();
      await AsyncStorage.setItem(rand_key_id, encrypted) 

      /* update the number of FHE keys */
      //add the new key
      account.Key_id.push(rand_key_id);
      //update the number of keys in buffer
      key_number = account.Key_id.length;
      //update key generation status
      if (key_number == 3) {
        account.FHE_indicator = false;
      }
      //and write the new data to storage
      await SecureStore.setItemAsync(SECURE_STORAGE_ACCOUNT, JSON.stringify(account))

      //console.log("Key number:", key_number)

      if(key_number >= 3) {
        //to change the page structure in the FHEKeyGen page
        dispatch( secureComputeProgress({
          FHE_key_progress: 100,
          FHE_key_inventory: 3,
          FHE_key_statusMSG: 'Key store filled.'
        }))
        /* Ready to compute */
        var smc =  await SecureStore.getItemAsync(SECURE_STORAGE_SMC);
        smc = smc ? JSON.parse(smc) : {};
        smc.FHE_key = true;
        dispatch( get_SMC_Success(smc) )
        await SecureStore.setItemAsync(SECURE_STORAGE_SMC, JSON.stringify(smc));

      }
  }
}

export const secureCompute = (data, algo_name) => async (dispatch) => {

  dispatch( secureComputeBegin() );

  dispatch( secureComputeProgress({
      SMC_compute_progress: 0,
      SMC_computing: true 
    })
  );

  const circle_indicator = async function(t, start, bin){
    for (var i = 0; i < bin; i++) {
      dispatch( secureComputeProgress({
        SMC_compute_progress: start + i/2,
        SMC_computing: true 
      }))
      await new Promise(resolve => setTimeout(resolve, t))
    }
  }

  var result = 0.0;
  var current = false;
  var haveSMC = false;

  if ( CanCompute( data ) ) {
  
    if (algo_name == 'smc') {

      if (__DEV__) console.log('SMC: Yes, there are enough data for computation');

      //----------- Configure settings ---------------------

      EnyaSMC.input(Object.values(data))
      EnyaSMC.configure({
        CLIENT_TOKEN: "f7edB8a8A4D7dff85d2CB7E5",
        algo_name: "sample_algo"
      })
      //-----------------------------------------------------
  
      //----------- Running the model -----------------------
      const [model, _] = await Promise.all([EnyaSMC.SMC(), circle_indicator(5, 0, 200)])
      //-----------------------------------------------------

      if(model.status_code == 200) {
        dispatch( secureComputeProgress({
          SMC_compute_progress: 100,
          SMC_computing: true 
        }))
        result = parseFloat(model.secure_result).toFixed(2);
        current = true; //because we just recomputed it
        haveSMC = true; //yes, we have result
      } else {
        dispatch( secureComputeProgress({
          SMC_compute_progress: 0,
          SMC_computing: false
        }))
      }

    } else if (algo_name == 'fhe') {

      if (__DEV__) console.log('Yes, there are enough data for FHE computation');

      // ------------------- The first way -----------------------------
      // ------------------ Simpler version ----------------------------
      // --------------- iPhone 11 needs 50s --------------------------- 
      // --------------- You can't monitor status ----------------------
      /*
        EnyaFHE.configure({
          AccessToken: "Bb9CEAe9A365Ac30FCE4d4AA",
          AlgorithmName: "first_algo"
        })
        const [model, _] = await Promise.all([EnyaFHE.FHE(Object.values(data)), circle_indicator(200, 0, 200)]);
        dispatch( secureComputeProgress({
          SMC_compute_progress: 100,
          SMC_computing: true 
        }));
        result = (model / 100000).toFixed(2);
        current = true; //because we just recomputed it
        haveSMC = true; //yes, we have result
      */
      //   --------------------------------------------------------------
      

      // ------------------- The second way ----------------------------
      // ------------------- Monitor the status ------------------------
      // ------------------- More complicated --------------------------
      // ---- For details, please check enyafhe/__test__/__test__.js ---
      /* Give token and algorithm name */

      EnyaFHE.Configure({
        CLIENT_TOKEN: "f7edB8a8A4D7dff85d2CB7E5",
        algo_name: "sample_algo"
      })

      /* Get fhe key id */
      var account = await SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT);
      account = account ? JSON.parse(account):{};
      var Key_id_update = account.Key_id;
      
      /* randomly pick one fhe key */
      var random_id = Key_id_update[Math.floor(Math.random()*Key_id_update.length)];
      var aes_encrypt = await AsyncStorage.getItem(random_id)
      var aes_iv_hex = aes_encrypt.slice(0,32);
      var aes_fhe_key = aes_encrypt.slice(32);
      var bytes = forge.util.hexToBytes(aes_fhe_key);
      aes_fhe_key = forge.util.createBuffer(bytes);

      /* Delete the used fhe key */
      Key_id_update = Key_id_update.filter(Key_id_update => !random_id.includes(Key_id_update))
      account.Key_id = Key_id_update
      await SecureStore.setItemAsync(SECURE_STORAGE_ACCOUNT, JSON.stringify(account));
      await AsyncStorage.removeItem(random_id)

      /* aes decrypt fhe keys */
      var aes_key = account.aes_key;
      var aes_iv = forge.util.hexToBytes(aes_iv_hex);
      var decipher = forge.cipher.createDecipher('AES-CBC', aes_key);
      decipher.start({iv: aes_iv});
      decipher.update(aes_fhe_key);
      var decipher_status = decipher.finish();
      var fhe_keys = JSON.parse(decipher.output.data);
  
      /* load fhe keys */
      var privatekey_fhe = fhe_keys.privatekey;
      var publickey_fhe = fhe_keys.publickey;
      var multikey_fhe = fhe_keys.multikey;
      var rotakey_fhe = fhe_keys.rotakey;

      /* Pack the weight */
      var plaintext = EnyaFHE.PackVector(Object.values(data));

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
    var [senddata, temp] = await Promise.all([
      EnyaFHE.SendData({ pcr: string_pcr, data: jsonpayload }),
      circle_indicator(50, 0, 80)
    ])
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
            if (__DEV__) console.log("EnyaFHE: Start to retrieve encrypted result.");
            /* Retrieve the calculation result */
            var [getresult, temp] = await Promise.all([
              EnyaFHE.GetResult({pcr: string_pcr}),
              circle_indicator(100, 40, 80)
            ]);
            const cipher_result = await getresult.json();

            if (__DEV__) console.log("EnyaFHE: Decrypting.");
            var ciphertext_res = EnyaFHE.ReadCiphertext(cipher_result.ciphertext);

            var [text, temp] = await Promise.all([
              EnyaFHE.DecryptVector(ciphertext_res, privatekey_fhe),
              circle_indicator(20, 80, 40)
            ])
            
            if (__DEV__) console.log("EnyaFHE: Finished decryption.")

            result = (text[0] / 100000).toFixed(2);
            current = true; 
            haveSMC = true;

            /* 
            Read the number of keys
            If there is no keys in storage,
            then it can't compute.
            */
            var account = await SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT);
            account = account ? JSON.parse(account):{};
            if ( account.Key_id.length == 0 ) {
              var smc =  await SecureStore.getItemAsync(SECURE_STORAGE_SMC);
              smc = smc ? JSON.parse(smc) : {};
              smc.FHE_key = false;
              dispatch( get_SMC_Success(smc) )
              await SecureStore.setItemAsync(SECURE_STORAGE_SMC, JSON.stringify(smc));
            }
        } else {
            /* Computation failed */
            if (__DEV__) console.log("Error: ", status);
            dispatch( secureComputeProgress({ 
              SMC_compute_progress: 0,
              SMC_computing: false 
            }));
        }
    } else {
        /* Computation failed */
        if (__DEV__) console.log("Failed to send encryption keys");
        dispatch( secureComputeProgress({ 
          SMC_compute_progress: 0,
          SMC_computing: false 
        }));
    } 
    
}
  } else {

    if (__DEV__) console.log('Not enough data for secure computation');

  }

  SecureStore.getItemAsync(SECURE_STORAGE_SMC).then(res => {

    const smc = res ? JSON.parse(res) : {};

    let updatedSMC = {
      ...smc,
      result,
      haveSMC,
      current,
      error: null
    };

    SecureStore.setItemAsync(SECURE_STORAGE_SMC, JSON.stringify(updatedSMC));

    if ( haveSMC ) {
    
      dispatch( secureComputeSuccess( updatedSMC ) );
      
      dispatch( secureComputeProgress({ 
          SMC_compute_progress: 100,
          SMC_computing: false 
        })
      );
    
    } else {

      dispatch( secureComputeFailure({error: 'Not enough data for secure computation'}) );

    }

  });

}