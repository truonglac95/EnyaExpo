import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, View, Text, Image, Alert } from 'react-native';

import BasicButton from '../components/BasicButton';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';
import mS from '../constants/masterStyle';

import { preport, getPreportState } from '../redux/actions';

//local storage
import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE_USER_ACCOUNT } from '../redux/constants';

class ResultPreportScreen extends React.Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text 
        style={{
          fontSize: 19,
          color: colors.headerFontColor,
          fontFamily: colors.headerFont,
          marginLeft: 'auto', 
          marginRight: 'auto',
          textAlign: 'center',
          alignSelf: 'center',
        }}>
          {i18n.t('premium_request_title')}
        </Text>
      ),
      headerRight: (<View></View>),
    }
  };

  constructor (props) {

    super(props);

    const { answers } = this.props.answer;

    this.state = {

      preportTime: null,
      preportTrue: false,

      birthyear: (answers.birthyear || 0),
      gender:(answers.gender || 0),
      height: (answers.height || 0),
      smoking: (answers.smoking || 0),
      weight: (answers.weight || 0),
      diabetes: (answers.diabetes || 0),
      hdlc: (answers.hdlc || 0),
      cholesterol: (answers.cholesterol || 0),
      bloodpressure: (answers.bloodpressure || 0),

    };
  
  }

  componentDidMount() {

    this.props.dispatch(getPreportState(this.props.user.account.UUID));

    SecureStore.getItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(result => {
      if (result){
        const account = result ? JSON.parse(result) : {};
        this.setState({
          preportTime: account.preportTime,
          preportTrue: account.preportTrue,
        });
      }
    });

  }

  handlePreportConfirmed = () => {

    let date = new Date();

    this.setState({
      preportTime: date.toString(),
      preportTrue: true,
    });

    const uuid = this.props.user.account.UUID;

    var datastring = 'pp:' + this.state.birthyear.toString() + ',' + this.state.height.toString() + ',' + this.state.weight.toString() + ',';
    datastring    += this.state.smoking.toString() + ',' + this.state.diabetes.toString() + ',' + this.state.gender.toString() + ',';
    datastring    += this.state.hdlc.toString() + ',' + this.state.cholesterol.toString() + ',' + this.state.bloodpressure.toString();

    //if (__DEV__) console.log(datastring)
    this.props.dispatch(preport(uuid, {preport_data : datastring}));

    SecureStore.getItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(result => {
      if (result){
        const account = result ? JSON.parse(result) : {};
        let newPreport = { 
          ...account,
          preportTime: date.toString(),
          preportTrue: true,
        };
        SecureStore.setItemAsync(SECURE_STORAGE_USER_ACCOUNT, JSON.stringify(newPreport));
      }
    })

  }

  handlePreport = () => {

  Alert.alert(
    i18n.t('premium_request'),
    i18n.t('premium_sure'),
    [
      { //in Android the 'negative' button comes first
        //iOS uses the style information
        text: i18n.t('account_no'),
        onPress: () => {},
        style: 'cancel',
      }, 
      {
        text: i18n.t('account_yes'),
        onPress: () => {this.handlePreportConfirmed()},
        style: 'default',
      },
    ],
    { cancelable: false },
  );

  } 

  render () {

    let internet = this.props.user.internet.internet_connected;

    const { preportTime, preportTrue } = this.state;

    return (

      <View style={mS.containerCenter}>
      
        {/*'general instructions at top of page'*/}
        <View style={{marginLeft: 'auto', marginRight: 'auto', width: '90%', marginBottom: 20}}>
          <Text style={[mS.descriptionSmall,{fontSize: 16}]}>{i18n.t('premium_detail')}</Text>
        </View>

        {/*'action button'*/}
        <View style={{marginLeft: 'auto', marginRight: 'auto', width: '70%', marginBottom: 20}}>
          <BasicButton 
            text={i18n.t('premium_request_button')} 
            onClick={this.handlePreport} 
            no_internet={!internet}
            todo={i18n.t('premium_request_button')}
          />
        </View>
        
        {/*'Report request timestamp'*/}
        {preportTrue && 
          <View style={{marginLeft: 'auto', marginRight: 'auto', width: '90%', marginBottom: 20}}>
            <Text style={[mS.descriptionSmall,{fontSize: 16}]}>
              <Text style={{fontWeight: 'bold'}}>{i18n.t('preport_request1')}</Text>
              {` `}{i18n.t('preport_request2')}{preportTime}.{` `}{i18n.t('preport_request3')}</Text>
          </View>
        }

      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  answer: state.answer,
});

export default connect(mapStateToProps)(ResultPreportScreen);
