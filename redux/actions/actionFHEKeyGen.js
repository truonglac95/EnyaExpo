import {
  FHE_KEYGEN_PROGRESS,
  SECURE_STORAGE_ACCOUNT,
} from '../constants';

import EnyaFHE from 'enyafhe'
import * as SecureStore from 'expo-secure-store'
import * as forge from 'node-forge';
import { AsyncStorage } from 'react-native';

export const FHEKeyGenProgress = (data) => ({ type: FHE_KEYGEN_PROGRESS, payload: data });

export const FHEKeyGen = () => async(dispatch) => {

  //how many fresh keys do we have right now?
  var account = await SecureStore.getItemAsync(SECURE_STORAGE_ACCOUNT)
  account = account ? JSON.parse(account) : {};
  var numberOfKeys = account.Key_id.length;

  dispatch(FHEKeyGenProgress({
    FHE_key_progress: 5,
    FHE_key_inventory: numberOfKeys,
    FHE_key_statusMSG: 'Preparing to compute keys...\n',
    FHE_keys_ready: false,
    FHE_key_computing: true
  }))

  while ( numberOfKeys < 3 ) {

    dispatch( FHEKeyGenProgress({
      FHE_key_progress: 10,
      FHE_key_inventory: numberOfKeys,
      FHE_key_statusMSG: 'Computing private key...\n',
      FHE_keys_ready: false,
      FHE_key_computing: true
    }))

    //generate new key_id
    var rand_key_id = Math.random().toString(36).substring(2, 5) + 
      Math.random().toString(36).substring(2, 5);
        
    /* Generate private key */
    var privatekey = await EnyaFHE.PrivateKeyGenRN()
      
    dispatch( FHEKeyGenProgress({
      FHE_key_progress: 20,
      FHE_key_inventory: numberOfKeys,
      FHE_key_statusMSG: 'Generated private key.\nComputing public key...\n',
      FHE_keys_ready: false,
      FHE_key_computing: true
    }))

    /* Generate public key */
    var publickey =  await EnyaFHE.PublicKeyGenRN(privatekey);

    dispatch( FHEKeyGenProgress({
      FHE_key_progress: 50,
      FHE_key_inventory: numberOfKeys,
      FHE_key_statusMSG: 'Generated public key.\nComputing multiplication key...\n',
      FHE_keys_ready: false,
      FHE_key_computing: true
    }))

    /* Generate multi key */
    var multikey = await EnyaFHE.MultiKeyGenRN(privatekey);

    dispatch( FHEKeyGenProgress({
      FHE_key_progress: 75,
      FHE_key_inventory: numberOfKeys,
      FHE_key_statusMSG: 'Generated multiplication key.\nComputing rotation key...\n',
      FHE_keys_ready: false,
      FHE_key_computing: true
    }))

    /* Generate rotation key */
    var rotakey = await EnyaFHE.RotaKeyGenRN(privatekey);

    dispatch( FHEKeyGenProgress({
      FHE_key_progress: 100,
      FHE_key_inventory: numberOfKeys,
      FHE_key_statusMSG: 'Generated rotation key.\nKeyGen complete.\n',
      FHE_keys_ready: false,
      FHE_key_computing: true
    }))

    var key = {
      privatekey: privatekey,
      publickey: publickey, 
      multikey: multikey, 
      rotakey: rotakey
    }

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

    //add the new key
    account.Key_id.push(rand_key_id);
    
    //update the number of keys in buffer
    numberOfKeys = account.Key_id.length;
    
    if(numberOfKeys >= 3)
      account.FHE_keys_ready = true;
    else 
      account.FHE_keys_ready = false;
    
    //and write the new data to non-volatile storage
    await SecureStore.setItemAsync(SECURE_STORAGE_ACCOUNT, JSON.stringify(account))

    //console.log("Number of keys:", numberOfKeys)

    if(numberOfKeys >= 3) {

      dispatch( FHEKeyGenProgress({
        FHE_key_progress: 100,
        FHE_key_inventory: 3,
        FHE_key_statusMSG: 'Key store filled.',
        FHE_keys_ready: true,
        FHE_key_computing: false
      }))

    }
  }
}