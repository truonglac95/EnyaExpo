const math = require("mathjs");
const crypto = require('crypto-js');

import { 
  SECURE_PRS_CHANNEL_1,
  SECURE_PRS_CHANNEL_2,
  SECURE_PRS_CHANNEL_3
 } from '../settings';

import {
  SECURE_COMPUTE_PROGRESS,
} from '../redux/constants';

const PRECISION = 10000 //precision makes sure 4 digits are reserved
const BITLENGTH = 8;
const USER_WEIGHT_SHAPE = [8]
const BLOCKDOC_WEIGHT_SHAPE = [288,8]

export function CanCompute( data ) {

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

export function NumGoodAnswers( data ) {

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

const secureComputeProgress = (data) => ({
  type: SECURE_COMPUTE_PROGRESS,
  payload: data,
});

export async function ComputeRiskSecure( data, uuid, id, dispatch ) {

  /* 
     Input: data: contains all user input
            uuid: contains user-specific uuid (permanent)
              id: contains login-specific id (lifetime shorter)
     Return:secure mpc risk score 
  */

  dispatch(secureComputeProgress( {
    SMC_compute_progress: 0,
    SMC_computing: true })
  );

  let risk_score = 0.0;
  
  // Parse input to acceptable format
  // data.gender: 1:male, 2:female
  //redefine to 0 = male and 1 = female

  var gender = 0

  if (data.gender >= 2) {gender = 1} else {gender = 0}

  //age 
  const age = (new Date().getFullYear()) - data.birthyear;

  console.log('ComputeRiskSecure: Go MPC jia you');

  // BMI: calculate from the height and weight
  const BMI = data.weight / Math.pow((data.height/100),2);

  var binary_1 = data.binary_1 - 1
  var binary_2 = data.binary_2 - 1

  const user_data = [gender, age, 127, BMI, 6.0, binary_1, binary_2, 1];

  const user_vector = [user_data[0], user_data[1], 1, 1, 1, 1, 1, 1];
  const hash_vector = crypto.MD5(user_data.toString()).toString()

  // pack all data as argument into 'request()' function
  data_package = [uuid, id, hash_vector, user_data, user_vector]

  risk_score = await riskscore( dispatch )

  return risk_score

}

/* Split user info*/
function split_random_share(user_info){
  var random_share_for_blockdoc = math.randomInt(USER_WEIGHT_SHAPE, 0, math.pow(2,BITLENGTH));
  return [ math.subtract(user_info, random_share_for_blockdoc ), random_share_for_blockdoc ]
}

/* Find the index of the array in the matrix, 
  matrix: shape (288,8), array: shape(8) */
function find_index(matrix, array){
  for (var i = 0; i < matrix.length; i++) {
      // this seems to be the only way..
      if    (matrix[i][0] == array[0] 
          && matrix[i][1] == array[1]
          && matrix[i][2] == array[2]
          && matrix[i][3] == array[3]
          && matrix[i][4] == array[4]
          && matrix[i][5] == array[5]
          && matrix[i][6] == array[6]
          && matrix[i][7] == array[7]){
          break;
      }
  }
  return i
}

/* For a given person, get the correct value pointer for him/her
input: [sex, age, SBP, BMI, TC, binary_1, binary_2, mean] */
function get_category(client_weight, category_insurance){
  var category_client = [0,0,0,0,0,0,0,0]

  // Sex is the same as input
  category_client[0] = client_weight[0];

  // Age only has 1 choice
  category_client[1] = 0;

  // SBP has 6 choices
  const SBP_category = category_insurance[0];
  while (client_weight[2] > SBP_category[category_client[2]]) 
    { category_client[2] ++; if (category_client[2] > SBP_category.length)
    { category_client[2] = SBP_category.length; break; }
  }

  // BMI has 2 choices
  const BMI_category = category_insurance[1];
  while (client_weight[3] > BMI_category[category_client[3]]) 
    { category_client[3] ++; if (category_client[3] > BMI_category.length)
    { category_client[3] = BMI_category.length; break; }
  }

  // TC has 3 choices
  const TC_category = category_insurance[2];
  while (client_weight[4] > TC_category[category_client[4]]) 
    { category_client[4] ++; if (category_client[4] > TC_category.length)
    { category_client[4] = TC_category.length; break; }}

 
  if (client_weight[5] > 0) { category_client[5] = 1 }
  else                      { category_client[5] = 0 } 
  if (client_weight[6] > 0) { category_client[6] = 1 }
  else                      { category_client[6] = 0 } 

  return category_client
}

// Split the user_weight for blockdoc
function random_share(user_info){
  // split the user weight 
  toInsurance = math.randomInt(USER_WEIGHT_SHAPE, 0, math.pow(2,BITLENGTH));
  return [math.subtract(user_info, toInsurance), toInsurance]
}

/* Retrieve API keys */
const validate = async input_json => {
  try { key =  await fetch(SECURE_PRS_CHANNEL_3 + 'uuid-whitelist', 
      {
        method:'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(input_json)
      })
    return_data = await key.json()
    return { status:key.status, data:return_data }}
catch ( error ) { return error }
}

/* Send the uuid and hash vector to the amazon server */
const send_hash_vector = async (key, input_json) => {

  try { return await fetch(SECURE_PRS_CHANNEL_1 + 'hash-vector', 
      {
        method:'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': key,
        },
      body: JSON.stringify(input_json)
      })
    }
  catch ( error ) { return error }
}

/* Send user id to Redis */
const send_id = async (key, input_json) => {
  try { return await fetch(SECURE_PRS_CHANNEL_1 + 'id-storage', 
      {
        method:'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': key,
        },
      body: JSON.stringify(input_json)
      })
    }
  catch ( error ) { return error }
}

/* User retrieve additional information for risk calculation */
const get_information = async(key) => {
  try { info = await fetch(SECURE_PRS_CHANNEL_1 + 'get-information',
      {
        method:'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': key,
        },
      })
      return_data = await info.json()
      return { status:info.status, data:return_data }}
  catch ( error ) { return error }
}

/* Update and retrieve beaver triple */
const get_beaver_triple = async (key, input_json) => {
  try { beaver_triple =  await fetch(SECURE_PRS_CHANNEL_2 + 'beaver-triple',
      {
        method:'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': key,
        },
        body:JSON.stringify(input_json)
      })
      return_data = await beaver_triple.json()
      return { status:beaver_triple.status, data:return_data }}
  catch ( error ) { return error }
}
 
/* Ask blockdoc to get new beaver triple */
const ask_beaver_triple = async (key, input_json) => {
  try { return await fetch(SECURE_PRS_CHANNEL_1 + 'blockdoc-beaver-triple', 
      {
        method:'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': key,
        },
        body: JSON.stringify(input_json)
      })
    }
  catch ( error ) { return error }
}

/* Random share from blockdoc */ 
const get_random_share = async (key, input_json) => {
  try { random_share =  await fetch(SECURE_PRS_CHANNEL_1 + 'random-share',
      {
        method:'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': key,
        },
        body:JSON.stringify(input_json)
      })
      return_data = await random_share.json()
      return { status:random_share.status, data:return_data }}
  catch ( error ) { return error }
}

/* Send am1_user, bm1_user to blockdoc and get back am1_user, bm_user from blockdoc */ 
const difference = async (key, input_json) => {
  try { blockdoc_diff =  await fetch(SECURE_PRS_CHANNEL_1 + 'difference',
      {
        method:'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': key,
        },
        body:JSON.stringify(input_json)
      })
      return_data = await blockdoc_diff.json()
      return { status:blockdoc_diff.status, data:return_data }}
  catch ( error ) { return error }
}

/* Get dot product from blockdoc */
const get_dot_product = async (key, input_json) => {
  try { 
    blockdoc_dp =  await fetch(SECURE_PRS_CHANNEL_1 + 'dot-product',
      {
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': key,
        },
        body:JSON.stringify(input_json)
      })
      return_data = await blockdoc_dp.json()
      return {status:blockdoc_dp.status, data:return_data}
     }
  catch ( error ) { return error }
}

// Main function
const requests = async(data_package, dispatch) => {

  dispatch(secureComputeProgress( {
    SMC_compute_progress: 15,
    SMC_computing: true, })
  );

  // Unpack all the data
  uuid = data_package[0];
  id = data_package[1];
  hash_vector = data_package[2];
  user_data = data_package[3];
  user_vector = data_package[4];

  // Test_code tracks the number of successful test during the risk score calculation
  var test_code = 0; 
  
  const api_keys = await validate({uuid:uuid});

  if (api_keys.status == 201){
    console.log("Step0: Successfully got API keys.");
    test_code++;
    dispatch(secureComputeProgress( {
      SMC_compute_progress: 25,
      SMC_computing: true,
    })
  );
  } else { console.log("Step0: Failed to get API keys."); return; }

  const rainbowPRS_KEY = api_keys.data.rainbowPRS_KEY;
  const securePRS_KEY  = api_keys.data.securePRS_KEY;

  // Post user_uuid 
  const user_uuid = await send_hash_vector(securePRS_KEY, {uuid:uuid, hash_vector:hash_vector});
  
  if (user_uuid.status == 201) { 
    console.log("Step1: Successfully sent UUID and stored it in Mysql."); 
    test_code++; 
    dispatch(secureComputeProgress( {
      SMC_compute_progress: 35,
      SMC_computing: true, })
    );
  } else { console.log("Step1: Failed to send UUID."); return; }

  // Post user_id 
  const user_id = await send_id(securePRS_KEY, {id:id});

  if (user_id.status == 201) { 
    console.log("Step2: Successfully sent id and stored it in Redis."); 
    test_code++; 
    dispatch(secureComputeProgress( {
      SMC_compute_progress: 45,
      SMC_computing: true,
    })
  );
  } else { console.log("Step2: Failed to send id."); return; }

  // Get information 
  const initial = await get_information(securePRS_KEY);
  
  if (initial.status == 200) { 
    console.log("Step3: Successfully got information.");
    dispatch(secureComputeProgress( {
      SMC_compute_progress: 55,
      SMC_computing: true,
    })
  ); 
    test_code++; 
  } else { console.log("Step3: Failed to get information."); return; }
  
  const blockdoc_categories    = initial.data.blockdoc_categories;
  const blockdoc_indices       = math.reshape(initial.data.blockdoc_indices, BLOCKDOC_WEIGHT_SHAPE);
  const blockdoc_survivalrates = initial.data.blockdoc_survivalrates;
  
  // Update and retrieve beaver triple 
  const beaver_triple = await get_beaver_triple(rainbowPRS_KEY, {id:id, name:"user"});
 
  if (beaver_triple.status == 201) { 
    console.log("Step4: Successfully updated and retrieved user Beaver triple."); 
    dispatch(secureComputeProgress( {
      SMC_compute_progress: 65,
      SMC_computing: true,
    })
  ); 
    test_code++; 
  } else { console.log("Step4: Failed to update and retrieve user Beaver triple."); return; }
  const user_beaver_triple = beaver_triple.data
  
  // Ask blockdoc to retrieve beaver triple 
  const other_beaver_triple = await ask_beaver_triple(securePRS_KEY, {id:id});

  if (other_beaver_triple.status == 201) { 
    console.log("Step5: Successfully asked blockdoc to retrieve Beaver triple."); 
    dispatch(secureComputeProgress( {
      SMC_compute_progress: 75,
      SMC_computing: true,
    })
  );
    test_code++; 
  } else { console.log("Step5: Failed to ask blockdoc to retrieve Beaver triple."); return; }
  
  // Random share from blockdoc 
  [retain_random_share, random_share_for_blockdoc] = split_random_share(user_vector);
  
  const random_share = await get_random_share(securePRS_KEY, {id:id,user_random_share:random_share_for_blockdoc});

  if (random_share.status == 201) { 
    console.log("Step6: Successfully sent and got random share."); 
    dispatch(secureComputeProgress( {
      SMC_compute_progress: 85,
      SMC_computing: true,
      })
    );
    test_code++; 
  } else { console.log("Step6: Failed to send and get random share."); return; }
  
  const random_share_from_blockdoc = math.reshape(random_share.data.blockdoc_share_for_user, BLOCKDOC_WEIGHT_SHAPE)
  
  // Extend the user beaver triple m2 to the same shape as blockdoc share
  var user_beaver_triple_m2 = [];
  for (var i=0; i<BLOCKDOC_WEIGHT_SHAPE[0]; i++) { user_beaver_triple_m2[i] = user_beaver_triple.m2; }
  
  const am1_user = math.subtract(retain_random_share, user_beaver_triple.m1);
  const bm2_user = math.subtract(random_share_from_blockdoc, user_beaver_triple_m2);
  
  
  const data = {id:id, user_diff:[math.reshape(am1_user,USER_WEIGHT_SHAPE), math.flatten(bm2_user)]}
  // Send and get difference from blockdoc
  const blockdoc_difference = await difference(securePRS_KEY, data);
  
  if (blockdoc_difference.status == 201) { 
    console.log("Step7: Successfully sent and got am1, bm1."); 
    dispatch(secureComputeProgress( {
      SMC_compute_progress: 100,
      SMC_computing: true,
      })
    );
    test_code++; 
  } else { console.log("Step7: Failed to send and get am1, bm1."); return; }
  
  // Compute user dot product
  const am1_blockdoc = math.reshape(blockdoc_difference.data.blockdoc_a_diff, USER_WEIGHT_SHAPE);
  const bm2_blockdoc = math.reshape(blockdoc_difference.data.blockdoc_b_diff, BLOCKDOC_WEIGHT_SHAPE);

  const am1 = math.add(am1_user, am1_blockdoc);
  const bm2 = math.add(bm2_user, bm2_blockdoc);
  
  const user_dp_1 = math.multiply(bm2, retain_random_share);
  const user_dp_2 = math.multiply(random_share_from_blockdoc, am1);
  const user_dp_3 = math.multiply(math.ones(BLOCKDOC_WEIGHT_SHAPE[0]), math.sum(user_beaver_triple.prod));
  const user_dp_4 = math.multiply(bm2, am1);
  
  const user_dot_product = math.subtract(math.add(user_dp_1, user_dp_2, user_dp_3), user_dp_4);

  // Get blockdoc dot product 
  const dot_product_from_blockdoc = await get_dot_product(securePRS_KEY, {id: id});
  
  if (dot_product_from_blockdoc.status == 201) { 
    console.log("Step8: Successfully got dot product from blockdoc."); 
    dispatch(secureComputeProgress( {
        SMC_compute_progress: 100,
        SMC_computing: true,
      })
    );
    test_code++; 
  } else { console.log("Step8: Failed to get dot product from blockdoc."); return; }

  const blockdoc_dot_product = dot_product_from_blockdoc.data.blockdoc_dp;
  const dot_product_final = math.add(user_dot_product, blockdoc_dot_product);
  
  const user_survival_rate = blockdoc_survivalrates[user_data[0]];
  const user_index = find_index(blockdoc_indices, get_category(user_data,blockdoc_categories));
  var risk_score = ((1 - math.pow(user_survival_rate, math.exp(dot_product_final.subset(math.index(user_index))/PRECISION))) * 100).toFixed(1);

  if (risk_score == 0.0) { risk_score = 0.1;  }
  if (risk_score > 30.0) { risk_score = 30.0; }
  
  dispatch(secureComputeProgress( {
      SMC_compute_progress: 100,
      SMC_computing: true,
    })
  );

  return [risk_score, test_code]
}

/* Maxiumum 5 times requests */
const riskscore = async (dispatch) => {

  dispatch(secureComputeProgress( {
      SMC_compute_progress: 5,
      SMC_computing: true,
    })
  );

  var test_code = 0, i = 1;
  while (test_code != 9 && i < 6) { 
    try { [risk_score, test_code] = await requests(data_package, dispatch); break; }
    catch (error) { console.log("Failed", i, "times"); i++}
    finally { if (test_code != 9 && i == 6){ console.log("\n" +  "Failed to get risk score, internet or server issues.") }}
  }
  if (test_code == 9 && i < 6) { 
    //console.log(risk_score); 
    return { 
      status: 200, 
      risk_score_ab: risk_score
    } 
  } 
  else {
    return { 
      status: 404 
    }
  }
}


