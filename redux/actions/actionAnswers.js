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
import * as SecureStore from 'expo-secure-store'
import EnyaFHE from 'enyafhe'


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
  
    if (algo_name == "smc") {

      if (__DEV__) console.log('SMC: Yes, there are enough data for computation');

      //----------- Configure settings ---------------------

      EnyaSMC.input(Object.values(data))
      EnyaSMC.configure({
        AccessToken: "f7edB8a8A4D7dff85d2CB7E5",
        AlgorithmName: "sample_algo"
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

    } else if (algo_name == "fhe") {

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
      // ------------------- Much more complicate ----------------------
      // ---- For details, plesae check enyafhe/__test__/__test__.js ---
      /* Give token and algorithm name */
      //Should do this somewhere else
      EnyaFHE.Configure({
        AccessToken: "f7edB8a8A4D7dff85d2CB7E5",
        AlgorithmName: "sample_algo"
      })

      /* Generate private key */
      var [privatekey, temp] = await Promise.all([EnyaFHE.PrivateKeyGenRN(), circle_indicator(1, 0, 40)]);
      if (__DEV__) console.log("Generated private key.")

      /* Generate public key */
      var [publickey, temp] =  await Promise.all([
        EnyaFHE.PublicKeyGenRN(), 
        circle_indicator(200, 20, 40)
      ]);
      if (__DEV__) console.log("Generated public key.")

      /* Generate multi key */
      var [multikey, temp] = await Promise.all([
        EnyaFHE.MultiKeyGenRN(), 
        circle_indicator(500, 40, 40)
      ]);
      if (__DEV__) console.log("Generated multiple key.")

       /* Generate rotation key */
      var [rotakey, temp] = await Promise.all([
        EnyaFHE.RotaKeyGenRN(), 
        circle_indicator(500, 60, 40)
      ]);
      if (__DEV__) console.log("Generated rotation key.")
      if (__DEV__) console.log("Finished key generations!")

      /* Pack the weight */
      var plaintext = EnyaFHE.PackVector(Object.values(data));
        
        /* Encrypt the plaintext */
      var ciphertext = EnyaFHE.EncryptVector(
        plaintext,
        publickey,
      );

      /* Create JSON payload */
      var jsonpayload = EnyaFHE.JSONPayload(
        publickey,
        multikey,
        rotakey,
        ciphertext
      );
      /* Random String */
      var string_pcr = EnyaFHE.RandomPCR();
      if (__DEV__) console.log("Random PCR: ", string_pcr)
      
      /* Send the payload to the server */
      var [senddata, temp] = await Promise.all([
        EnyaFHE.SendData({ pcr: string_pcr, data: jsonpayload }),
        circle_indicator(20, 80, 20)
      ])
      const return_messgae = await senddata.json();
      if (return_messgae.status == true) { 
          if (__DEV__) console.log("Sent encryption keys.");

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
              if (__DEV__) console.log("The calculation was finished.");
              if (__DEV__) console.log("Start to retrieve encrypted result.");
              /* Retrieve the calculation result */
              var [getresult, temp] = await Promise.all([
                EnyaFHE.GetResult({pcr: string_pcr}),
                circle_indicator(5, 90, 20)
              ]);
              const cipher_result = await getresult.json();

              if (__DEV__) console.log("Start to decrypt the ciphertext.");
              var ciphertext = EnyaFHE.ReadCiphertext(cipher_result.ciphertext);
              var text = EnyaFHE.DecryptVector(ciphertext);
              result = (text[0] / 100000).toFixed(2);
              current = true; 
              haveSMC = true; 
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