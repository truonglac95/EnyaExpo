import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, TextInput, Image} from 'react-native';

import { connect } from 'react-redux';
import { Alert } from 'react-native';

import CodeInput from 'react-native-confirmation-code-field';

import * as EnyaDeliver from 'enyadeliver';
import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_ACCOUNT } from '../redux/constants';
import { setAccount } from '../redux/actions';

//import { verifyUser, signOut } from '../redux/actions';
//import colors from '../constants/Colors';

class CodeScannerPin extends React.Component {
  
  constructor (props) {

    super(props);

    this.state = {
      errorMessage: '',
    };
  
  }

  UNSAFE_componentWillReceiveProps (nextProps) {

/*
    const { user } = this.props;
    const { user: nextUser } = nextProps;
    if (user && user.verifyLoading && nextUser && !nextUser.verifyLoading && nextUser.verifyError) {
      this.setState({
        errorMessage: 'Verification Failed!',
      });

      this.refs.codeInputRef.clear();
    }
*/
  }

  handleSetPin = (code) => {
    
    const { user } = this.props;
    const string = user.account.string

    EnyaDeliver.QRSetCredentials(string, code).then(result => {

      if (result.statuscode == 201){

        SecureStore.deleteItemAsync(SECURE_STORAGE_ACCOUNT).then(()=>{}).catch(()=>{});
  
        const firstlogintime = new Date().getTime().toString();
        const id = 'id-' + Math.random().toString(36).substring(2, 15) + '-' + firstlogintime;
        
        let UUID = result.UUID;

        let newAccount = { UUID, id, string };
    
        //save to secure storage
        SecureStore.setItemAsync(SECURE_STORAGE_ACCOUNT, JSON.stringify(newAccount));
    
        //circulate props
        this.props.dispatch(setAccount(newAccount));

      } else if (result.statuscode == 401){
        Alert.alert(
          "Error",
          "Wrong PIN code!",
          [{text: 'Ok'}]
        );
        this.refs.codeInputRef.clear();
      } else if (result.statuscode == 404){
        Alert.alert(
          "Error",
          "invalid qr code",
          [{text: 'Ok'}]
        );
        SecureStore.deleteItemAsync(SECURE_STORAGE_ACCOUNT).then(()=>{}).catch(()=>{});
        this.props.dispatch(setAccount({}));
      }
  
  
    }).catch(err => {
  
      console.log(err)
  
    });

    this.setState({
      errorMessage: '',
    });
    
    //this.props.dispatch(verifyUser(this.props.user.token, code));
  }

  handleLogout = () => {

    //this.props.dispatch(signOut());
  
  }

  render () {

    const { errorMessage } = this.state;

    return (
    <View style={styles.container}>
      <Image 
        style={styles.topLogo} 
        source={require('../assets/images/logo.png')} 
      />
      <View>
        <Text style={styles.baseText}>Please set a PIN code:</Text>
      </View>
      <View style={{height: 80}}>
        <CodeInput
          ref="codeInputRef"
          className="border-box"
          secureTextEntry
          activeColor='rgba(216, 45, 39, 1)'
          inactiveColor='rgba(216, 45, 39, 1)'
          autoFocus={false}
          ignoreCase={true}
          codeLength={6}
          inputPosition='center'
          keyboardType='numeric'
          size={45}
          onFulfill={this.handleSetPin}
          containerStyle={{ marginBottom: 10 }}
          codeInputStyle={{ borderWidth: 1 }}
        />
      </View>
      <View>
        <TouchableOpacity style={{marginTop: 20}} 
          onPress={this.handleLogout}>
          <Text style={styles.redText}>Login with another user</Text>
        </TouchableOpacity>
      </View>
      {!!errorMessage && 
        <View>
          <Text style={styles.redText}>{errorMessage}</Text>
        </View>
      }
    </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  topLogo: {
    width: 70,
    height: 70,
    marginTop: 100,
    marginBottom: 30,
  },
  baseText: {
    color: '#586068',
    fontWeight: 'normal',
    fontSize: 18,
    margin: 10,
  },
  redText: {
    color: '#FB2E59',
    fontWeight: 'normal',
    fontSize: 18,
    margin: 10,
  },
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(CodeScannerPin);