import React from 'react';
import { connect } from 'react-redux';

import { Platform, Text, TouchableOpacity,
  View, FlatList, Image, ActivityIndicator, Dimensions, 
  ScrollView, ImageBackground } from 'react-native';

import ProgressCircle from '../components/ProgressCircle';
import BasicButton from '../components/BasicButton';
import {mS, mC} from '../constants/masterStyle';

// Actions
import { secureComputeSMC, secureComputeFHESimple, getAnswers, secureComputeFHEBuffered } from '../redux/actions';

class Home extends React.Component {  

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text style={mS.screenTitle}>{'Enya Demonstrator'}</Text>),
    }
  }

  constructor (props) {

    super(props); 

    const { compute } = this.props;
    const { account } = this.props.user;
    const { answers } = this.props.answer;
    const { progress } = this.props.fhe;

    this.state = {
      
      //answers
      percentAnswered: (answers.percentAnswered || 0), //0 to 100
      
      //compute
      result: (compute.result || 0.0), //e.g. 14.5
      current: (compute.current || false), //is the score valid/current?
      computing: (compute.computing || false),
      compute_type: (compute.compute_type || 'smc'),

      //FHE key gen
      FHE_key_inventory: (progress.FHE_key_inventory || 0),
      FHE_keys_ready: (progress.FHE_keys_ready || false),
      FHE_key_computing: (progress.FHE_key_computing || false),

      //this screen
      recalculating: false,

    };

  }

  handleClickItem = (page) => {

    if (page === 'RESULT_SC') {
      this.props.navigation.navigate('ResultSC');
    } else if (page === 'GIVE_ANSWERS') {
      this.props.navigation.navigate('Questionnaire');
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    const { compute } = nextProps;
    const { answers } = nextProps.answer;
    const { progress } = nextProps.fhe;
    const { account } = nextProps.user;

    this.setState({
      percentAnswered: (answers.percentAnswered || 0.0),
      
      result: (compute.result || 0.0),
      current: (compute.current || false),
      computing: (compute.computing || false),
      compute_type: (compute.compute_type || 'smc'),
      
      FHE_key_inventory: (progress.FHE_key_inventory || 0),
      FHE_key_computing: (progress.FHE_key_computing || false),

      FHE_keys_ready: (progress.FHE_keys_ready || false),
    })

    //go to fresh result once calculation is done
    if ( this.state.recalculating && !this.state.computing ) {
      this.setState({recalculating: false});
      this.props.navigation.navigate('ResultSC');
    }

  }

  handleSMCCalculate = () => {
    const {answers} = this.props.answer;
    this.props.dispatch( secureComputeSMC(answers) );
    this.setState({recalculating:true,computing:true});
  }

  handleFHECalculateS = () => {
    const {answers} = this.props.answer;
    this.props.dispatch(secureComputeFHESimple(answers));
    this.setState({recalculating:true,computing:true});
  }

  handleFHECalculateB = () => {
    const {answers} = this.props.answer;
    this.props.dispatch(secureComputeFHEBuffered(answers));
    this.setState({recalculating:true,computing:true});
  }

  render() {

    const { current, percentAnswered, result,
      computing, compute_type, FHE_keys_ready,
      FHE_key_inventory, FHE_key_computing 
    } = this.state;

    var score = parseFloat(result).toFixed(1);

    return (

<View style={mS.containerCenterA}>

<ScrollView 
  contentContainerStyle={{alignItems: 'center'}}
  showsVerticalScrollIndicator={false}
  overScrollMode={'always'}
>

{/********************************************
      THE FIRST BOX - Summary
**********************************************/}

<View style={mS.shadowBox}>

<ImageBackground source={require('../assets/images/id.png')} style={{width: '100%', height: 50}}>
  <Text style={mS.boxTitle}>{'Overview'}</Text>
</ImageBackground>

{!current &&
<View style={mS.textBlock}>
<Text style={mS.mediumDark}>{'We cannot compute your score yet.'}</Text>
<Text style={mS.smallGray}>{'Please answer the questions about you. With that \
information, we can VALUE_PROP. Lorem ipsum dolor sit amet, consectetur adipiscing \
elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}</Text>
</View>
}
{current && (score <= 10) &&
<View style={mS.textBlock}>
<Text style={mS.mediumDark}>{'We have securely computed your score.'}</Text>
<Text style={mS.smallGray}>{'\nYour score is '}
<Text style={[mS.smallGray, {fontWeight: 'bold'}]}>{score}%</Text>
{'. Since your score is below 10, lorem ipsum dolor sit amet, \
consectetur adipiscing elit, sed do eiusmod tempor.'}</Text>
</View>
}
{current && (score > 10) &&
<View style={mS.textBlock}>
<Text style={mS.mediumDark}>{'We have securely calculated your score.'}</Text>
<Text style={mS.smallGray}>{'\nYour score is '}
<Text style={[mS.smallGray, {fontWeight: 'bold'}]}>{score}%</Text>
{'. Since your score is above 10, lorem ipsum dolor sit amet, \
consectetur adipiscing elit, sed do eiusmod tempor.'}</Text>
</View>
}

</View>

{/********************************************
      App info and status box 
**********************************************/}

{computing &&
  <View style={mS.shadowBox}>

  <ImageBackground source={require('../assets/images/id.png')} style={{width: '100%', height: 50}}>
    <Text style={mS.boxTitle}>{'Status'}</Text>
  </ImageBackground>

  {(compute_type == 'fhes') &&
    <View style={mS.textBlock}>
      <Text style={mS.mediumDark}>{'Unbuffered FHE calculation.'}</Text>
      <Text style={mS.smallGray}>{"This is the 'slowest' way to compute a result. Expect the result to arrive in about 1 minute."}</Text>
    </View>
  }
  {(compute_type == 'fheb') &&
    <View style={mS.textBlock}>
      <Text style={mS.mediumDark}>{'Buffered FHE calculation.'}</Text>
      <Text style={mS.smallGray}>{'This computation uses precomputed FHE keys to provide a better user experience.'}</Text>
    </View>
  }
  {(compute_type == 'smc') &&
    <View style={mS.textBlock}>
      <Text style={mS.mediumDark}>{'Secure Multiparty Computation.'}</Text>
      <Text style={mS.smallGray}>{'This is the fastest way to compute a result.'}</Text>
    </View>
  }

  </View>
}

{/********************************************
      THE THIRD BOX - SMC
**********************************************/}

<View style={mS.shadowBox}>

<ImageBackground source={require('../assets/images/id.png')} style={{height: 50}}>
  <Text style={mS.boxTitle}>{'Secure Computation'}</Text>
</ImageBackground>

<View style={{display: 'flex', flexDirection: 'row'}}>
<View style={mS.smc}>

{/*'there is an SC result - allow people to view the result and to update their answers'*/}
{current && 
<View>
<BasicButton 
  text={'View Result'}
  width="80%" 
  onClick={()=>this.handleClickItem('RESULT_SC')}
/>
<TouchableOpacity 
  style={{marginTop: 20}}
  hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
  onPress={()=>this.handleClickItem('GIVE_ANSWERS')}>
  <Text style={mS.largeAction}>{'Change Answers and Recompute'}</Text>
</TouchableOpacity>
</View>
}

{/*'no SMC result - prompt people to answer questions and to give/update their answers'*/}
{!current && (percentAnswered < 100) && 
<View>
<TouchableOpacity 
  hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
  onPress={()=>this.handleClickItem('GIVE_ANSWERS')}
>
  <Text style={mS.largeAction}>{'Complete my information'}</Text>
</TouchableOpacity>
<Text style={[mS.smallGray, {marginTop: 5}]}>{'to get personalized recommendations.'}</Text>
</View>
}

{/*'no SMC result - but we have all the data and need to recalculate'*/}
{!current && (percentAnswered === 100) && 
<View>
<Text style={mS.smallGray}>{'All questions answered'}</Text>
<View style={{marginTop: 20}}>
  <BasicButton 
    text={'SMC Compute'}
    width="100%"
    onClick={this.handleSMCCalculate}
    enable={!computing}
  />
</View>
<View style={{marginTop: 20}}>
  <BasicButton 
    text={'FHE_S Compute'}
    width="100%"
    onClick={this.handleFHECalculateS}
    enable={!computing}
  />
</View>
<View style={{marginTop: 20}}>
  <BasicButton 
    text={'FHE_B Compute'}
    width="100%"
    onClick={this.handleFHECalculateB}
    enable={!computing}
    keys_ready={FHE_keys_ready}
  />
</View>
</View>
}

</View>

{/*the right side of the SMC panel*/}

<View style={mS.smcRight}>

{current &&
<View>
  <Text style={[mS.gray, {textAlign: 'center', fontWeight: 'bold', fontSize: 30}]}>{score}%</Text>
  <Text style={[mS.smallGray, {textAlign: 'center'}]}>{'Your Score'}</Text>
</View>
}

{/*'not enough data - display progress answering questions'*/}
{!current && !computing && 
  <View style={mS.circleProgress}>
    <ProgressCircle percent={percentAnswered}>
      <Text style={mS.progressIcon}>{`${percentAnswered}%`}</Text>
    </ProgressCircle>
    <View>
      <Text style={mS.progressText}>{'Questions Answered'}</Text>
    </View>
  </View>
}

{/*show progress indicator when calculating risk*/}
{computing &&
  <View style={mS.circleProgress}>
    <ActivityIndicator size="large" color='#33337F' />
    <Text style={[mS.progressText]}>{'Computing'}</Text>
  </View>
}

</View>
</View>

</View>

</ScrollView>
</View>);
}}

const mapStateToProps = state => ({
  user: state.user,
  answer: state.answer,
  compute: state.compute,
  fhe: state.fhe,
});

export default connect(mapStateToProps)(Home);