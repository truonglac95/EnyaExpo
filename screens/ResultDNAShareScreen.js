import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, View, Text, Image, Alert } from 'react-native';

import BasicButton from '../components/BasicButton';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';
import mS from '../constants/masterStyle';

import { shareDNA, getSharingState } from '../redux/actions';

//local storage
import * as SecureStore from 'expo-secure-store';

import { 
  SECURE_STORAGE_USER_ACCOUNT,
} from '../redux/constants';

class ResultDNAShareScreen extends React.Component {
  
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
          {i18n.t('share_results')}
        </Text>
      ),
      headerRight: (<View></View>),
    }
  };

  constructor (props) {

    super(props);

    this.state = {
      shareTime: null,
      share_dna_time: null,
      shareTrue: false,
    };
  
  }

  componentDidMount() {

    this.props.dispatch(getSharingState(this.props.user.account.UUID));

    SecureStore.getItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(result => {
      if (result){
        const account = result ? JSON.parse(result) : {};
        this.setState({
          shareTime: account.shareTime,
          share_dna_time: account.share_dna_time,
          shareTrue: account.shareTrue,
        });
      }
    });

  }

  handleShareConfirmed = () => {

    let date = new Date();

    let unix_time = date.getTime().toString();

    this.setState({
      shareTime: date.toString(),
      share_dna_time: unix_time, 
      shareTrue: true,
    });

    const uuid = this.props.user.account.UUID;

    this.props.dispatch(shareDNA(uuid, {share_dna_time: unix_time}));

    SecureStore.getItemAsync(SECURE_STORAGE_USER_ACCOUNT).then(result => {
      if (result){
        const account = result ? JSON.parse(result) : {};
        let newShare = { 
          ...account,
          shareTime: date.toString(),
          shareTrue: true,
          share_dna_time: unix_time, 
        };
        SecureStore.setItemAsync(SECURE_STORAGE_USER_ACCOUNT, JSON.stringify(newShare));
      }
    })

  }

  handleShare = () => {

  Alert.alert(
    i18n.t('share_DNA_results'),
    i18n.t('share_are_you_sure'),
    [
      { //in Android the 'negative' button comes first
        //iOS uses the style information
        text: i18n.t('account_no'),
        onPress: () => {},
        style: 'cancel',
      }, 
      {
        text: i18n.t('account_yes'),
        onPress: () => {this.handleShareConfirmed()},
        style: 'default',
      },
    ],
    { cancelable: false },
  );

  } 

  render () {

    const { shareTime, shareTrue } = this.state;
    
    let internet = this.props.user.internet.internet_connected;
    
    let sharingStateText = '';

    //if (__DEV__) console.log('this.props.user.sharingState.data')
    //if (__DEV__) console.log(this.props.user.sharingState.data)
    //if (__DEV__) console.log(shareTrue)

    switch (this.props.user.sharingState.data) {
      //case zero is default case. Don't display anything in this case
      case 1:
        /*'We have received your sharing request.'*/
        sharingStateText = i18n.t('share_status_1');
        break;
      case 2:
        /*'Your result is on the way to the doctor.'*/
        sharingStateText = i18n.t('share_status_2');
        break;
      case 3:
        /*'Your result has been shared with your doctor.'*/
        sharingStateText = i18n.t('share_status_3');
        break;
    }

    return (

      <View style={mS.containerCenter}>
      
        {/*general instructions at top of page*/}
        <View style={{marginLeft: 'auto', marginRight: 'auto', width: '90%', marginBottom: 20}}>
          <Text style={[mS.descriptionSmall,{fontSize: 16}]}>{i18n.t('share_results_detail')}</Text>
        </View>

        {/*action button*/}
        <View style={{marginLeft: 'auto', marginRight: 'auto', width: '70%', marginBottom: 20}}>
          <BasicButton 
            text={i18n.t('share_results')} 
            onClick={this.handleShare} 
            no_internet={!internet}
            todo={i18n.t('share_results')}
          />
        </View>

        {shareTrue && <View style={{marginLeft: 'auto', marginRight: 'auto', width: '90%', marginBottom: 20}}>
          <Text style={[mS.descriptionSmall,{fontSize: 16}]}>
            <Text style={{fontWeight: 'bold'}}>{i18n.t('share_request1')}</Text>{` `}{i18n.t('share_request2')}{shareTime}.</Text>
        </View>}

        {!!sharingStateText && <View style={{marginLeft: 'auto', marginRight: 'auto', width: '90%'}}>
          <Text style={[mS.descriptionSmall,{fontSize: 16}]}>
            <Text style={{fontWeight: 'bold'}}>{i18n.t('share_sharing_status')}</Text>{` `}{sharingStateText}</Text>
        </View>}

        
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(ResultDNAShareScreen);