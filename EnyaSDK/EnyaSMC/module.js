/*

EnyaSMC provides the computation API and SDK for 
your app enabling privately computation on sensitive data.

Blockdoc
help@blockdoc.com
version 1.0.0 DEC 25, 2019

*/

const math = require("mathjs");
const fetch = require("node-fetch");
var sourceFile = require('./src/auth')

// ---------------------------------------------------------------
/* Retrieve decimal */
const compute_decimal = function(ob){
    decimal = 0;
    for (var i = 0; i < ob.length; i++) {
        s = ob[i].toString().split(".");
        if (s.length > 1) { if (s[1].length > decimal) { decimal = s[1].length } }
    }
    return decimal
}

/* Retrieve API keys */
const Request_Keys = async input_json => {
try { key =  await fetch(sourceFile.SECURE_PRS_CHANNEL_1 + 'token-verify', 
    {
        method:'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': sourceFile.SECURE_KEY,
        },
        body: JSON.stringify(input_json)
    })
    return_data = await key.json()
    return { status:key.status, data:return_data }}
catch ( error ) { return error }
}

/* Update and retrieve beaver triple */
const get_beaver_triple = async (key, input_json) => {
    try { beaver_triple =  await fetch(sourceFile.SECURE_PRS_CHANNEL_2 + 'Enya-beaver-triple-linear',
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
    try { return await fetch(sourceFile.SECURE_PRS_CHANNEL_3 + 'EnyaSMC-beaver-triple-linear', 
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
    try { random_share =  await fetch(sourceFile.SECURE_PRS_CHANNEL_3 + 'EnyaSMC-random-share-linear',
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
    try { blockdoc_diff =  await fetch(sourceFile.SECURE_PRS_CHANNEL_3 + 'EnyaSMC-difference-linear',
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
      blockdoc_dp =  await fetch(sourceFile.SECURE_PRS_CHANNEL_3 + 'EnyaSMC-dot-product-linear',
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
// ----------------------------------------------------------------

/**
* Input structure for configure settings.
* @param {input} Object - { AccessToken: "token", Algorithm: "name"}
*/
exports.configure = function(input){
    valid_token = input.AccessToken
    model_name = input.Algorithm
    if (typeof input.Bitlength == "undefined") { bitlength =  8} 
    else { bitlength = input.Bitlength }
}

/**
* Input structure for weights.
* @param arguments  - Array
*/
exports.input = function() {
    user_info = Array.prototype.slice.call(arguments)
    user_shape = [1, user_info.length]
}

/**
 * Multi-party linear computations.
 * @return Object - successful output {secure_result: dot_product_final, status_code: status_code} or
 * failure output {status_code: status_code}
 */
exports.Linear = async function(){
    
    var status_code = 404;

    if (typeof user_info == "undefined")   { if (__DEV__) console.log("Please input user info first"); return status_code; }
    if (typeof model_name == "undefined")  { if (__DEV__) console.log("Please enter the name of your algorithm"); return status_code; }
    if (typeof valid_token == "undefined") { if (__DEV__) console.log("Please enter access token"); return status_code; }

    if (__DEV__) console.log("EnyaSMC: Starting secure linear regression computation!")

    decimal = compute_decimal(user_info);
    user_info = math.multiply(user_info, math.pow(10, decimal));

    random_share_for_blockdoc = math.randomInt(user_shape, 0, math.pow(2,bitlength))[0];
    random_share_user_retain = math.subtract(user_info, random_share_for_blockdoc);

    // Generate random id
    id =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    if (__DEV__) console.log("EnyaSMC: Generated random id -- " + id)

    const API_Keys = await Request_Keys({token: valid_token})
    if (API_Keys.status == 201){ 
      if (__DEV__) console.log("EnyaSMC: Retrieved two API keys."); 
    } 
    else { 
      if (__DEV__) console.log("EnyaSMC: Failed to retrieve two API keys, please check your token or contact blockdoc <help@blockdoc.com>"); return status_code; }
    
    const beavertriple_token = API_Keys.data.token1;
    const blockdoc_token = API_Keys.data.token2;
    
    const beaver_triple = await get_beaver_triple(beavertriple_token, {token: valid_token, name:"user", coeff_name:model_name, bitlength:bitlength, id:id})

    if (beaver_triple.status == 201){ if (__DEV__) console.log("EnyaSMC: Updated and retrieved user Beaver triple."); } 
    else { if (__DEV__) console.log("EnyaSMC: Failed to update and retrieve user Beaver triple. " + beaver_triple.data); return status_code; }
    
    const user_beaver_triple = beaver_triple.data;
    const user_beaver_triple_m1 = user_beaver_triple.m1;
    const user_beaver_triple_m2 = user_beaver_triple.m2;

    // Double check the length of user input data
    if (user_beaver_triple_m1.length != user_info.length) {
        if (__DEV__) console.log("The length of user_input was different from the length of coefficients, please check!"); return status_code;
    }

    const other_beaver_triple = await ask_beaver_triple(blockdoc_token, {id:id});

    if (other_beaver_triple.status == 201) { if (__DEV__) console.log("EnyaSMC: Server retrieved Beaver triple."); } 
    else { if (__DEV__) console.log("EnyaSMC: Server failed to retrieve Beaver triple."); return status_code; }

    const random_share = await get_random_share(blockdoc_token, {id:id, token:valid_token, user_random_share:random_share_for_blockdoc, bitlength:bitlength, coeff_name:model_name});

    if (random_share.status == 201) { if (__DEV__) console.log("EnyaSMC: Sent and got random share."); } 
    else { if (__DEV__) console.log("EnyaSMC: Failed to send and get random share."); return status_code; }

    const random_share_from_blockdoc = random_share.data.blockdoc_share_for_user;

    const am1_user = math.subtract(random_share_user_retain, user_beaver_triple_m1);
    const bm2_user = math.subtract(random_share_from_blockdoc, user_beaver_triple_m2);

    const blockdoc_difference = await difference(blockdoc_token, {id:id, user_diff:[am1_user, bm2_user]});

    if (blockdoc_difference.status == 201) { if (__DEV__) console.log("EnyaSMC: Sent and got am1, bm1."); } 
    else { if (__DEV__) console.log("EnyaSMC: Failed to send and get am1, bm1."); return status_code; }
    
    const am1_blockdoc = blockdoc_difference.data.blockdoc_a_diff;
    const bm2_blockdoc = blockdoc_difference.data.blockdoc_b_diff;

    const am1 = math.add(am1_user, am1_blockdoc);
    const bm2 = math.add(bm2_user, bm2_blockdoc);

    const user_dp_1 = math.multiply(bm2, random_share_user_retain);
    const user_dp_2 = math.multiply(random_share_from_blockdoc, am1);
    const user_dp_3 = math.sum(user_beaver_triple.prod);
    const user_dp_4 = math.multiply(bm2, am1);

    const user_dot_product = math.subtract(math.add(user_dp_1, user_dp_2, user_dp_3), user_dp_4);

    const dot_product_from_blockdoc = await get_dot_product(blockdoc_token, {id:id});

    if (dot_product_from_blockdoc.status == 201) { if (__DEV__) console.log("EnyaSMC: Got dot product from server."); } 
    else { if (__DEV__) console.log("EnyaSMC: Failed to get dot product from blockdoc."); return status_code; }

    const blockdoc_dot_product = dot_product_from_blockdoc.data.blockdoc_dp;
    const dot_product_final = math.add(user_dot_product, blockdoc_dot_product) / math.pow(10, decimal)
    var status_code = 200;

    if (__DEV__) console.log("EnyaSMC: Finished computation!")

    return {secure_result: dot_product_final, status_code: status_code}
}