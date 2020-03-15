import React from 'react';
import { connect } from 'react-redux';

import { Platform, Text, TouchableOpacity,
  View, FlatList, Image, ActivityIndicator, Dimensions, 
  ScrollView, ImageBackground } from 'react-native';

import ProgressCircle from '../components/ProgressCircle';
import BasicButton from '../components/BasicButton';
import {mS, mC} from '../constants/masterStyle';

// Actions
import { secureCompute, getResults, getAnswers } from '../redux/actions';

class Home extends React.Component {  

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text style={mS.screenTitle}>{'Enya Demonstrator'}</Text>),
    }
  }

  constructor (props) {

    super(props); 

    const { smc } = this.props.answer;

    this.state = {
      percentAnswered: (smc.percentAnswered || 0), //0 to 100
      result: (smc.result || 0.0), //e.g. 14.5
      current: (smc.current || false), //is the score valid/current?
      FHE_keys_ready: (smc.FHE_keys_ready || false),
      SMC_compute_progress: (this.props.answer.SMC_compute_progress || 0),
      SMC_computing: (this.props.answer.SMC_computing || false),

      recalculating: false,

    };

  }

  handleClickItem = (page) => {

    if (page === 'RESULT_SMC') {
      this.props.navigation.navigate('ResultSMC');
    } else if (page === 'GIVE_ANSWERS') {
      this.props.navigation.navigate('Questionnaire');
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    const { smc } = nextProps.answer;

    this.setState({
      percentAnswered: (smc.percentAnswered || 0.0),
      result: (smc.result || 0.0),
      current: (smc.current || false),
      FHE_keys_ready: (smc.FHE_keys_ready || false),
      SMC_compute_progress: (nextProps.answer.SMC_compute_progress || 0),
      SMC_computing: (nextProps.answer.SMC_computing || false),

    });

    //go to fresh result once calculation is done
    if ( this.state.recalculating && nextProps.answer.SMC_compute_progress === 100 ) {
      this.setState({recalculating: false});
      this.props.navigation.navigate('ResultSMC');
    }

  }

  handleSMCCalculate = () => {

    const { dispatch } = this.props;
    const { answers } = this.props.answer;
    dispatch( secureCompute(answers, 'smc') );
    this.setState({recalculating: true});

  }

  handleFHECalculate = () => {

    const { dispatch } = this.props;
    const { answers } = this.props.answer;
    dispatch( secureCompute(answers, 'fhe') );
    this.setState({recalculating: true});

  }

  render() {

    const { current, percentAnswered, result, SMC_compute_progress, 
      SMC_computing, FHE_keys_ready } = this.state;

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
      THE SECOND BOX - SMC
**********************************************/}

<View style={mS.shadowBox}>

<ImageBackground source={require('../assets/images/id.png')} style={{height: 50}}>
  <Text style={mS.boxTitle}>{'Secure Computation'}</Text>
</ImageBackground>

<View style={{display: 'flex', flexDirection: 'row'}}>
<View style={mS.smc}>

{/*'there is an SMC result - allow people to view the result and to update their answers'*/}
{current && 
<View>
<BasicButton 
  text={'View Result'}
  width="80%" 
  onClick={()=>this.handleClickItem('RESULT_SMC')}
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
    text={'SMC Compute Score'}
    width="100%"
    onClick={this.handleSMCCalculate}
  />
</View>
<View style={{marginTop: 20}}>
  <BasicButton 
    text={'FHE Compute Score'}
    width="100%"
    onClick={this.handleFHECalculate}
    enable = {FHE_keys_ready}
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
{!current && !SMC_computing && 
  <View style={mS.circleProgress}>
    <ProgressCircle percent={percentAnswered}>
      <Text style={mS.progressIcon}>{`${percentAnswered}%`}</Text>
    </ProgressCircle>
    <View>
      <Text style={mS.progressText}>{'Questions Answered'}</Text>
    </View>
  </View>
}

{/*'show progress indicator when calculating score'*/}
{SMC_computing && 
  <View style={mS.circleProgress}>
    <ProgressCircle percent={SMC_compute_progress} cog={true}/>
    <View>
      {(SMC_compute_progress   < 100) && <Text style={mS.progressText}>{'Computing'}</Text>}
      {(SMC_compute_progress === 100) && <Text style={mS.progressText}>{'Done'}</Text>}
    </View>
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
  result: state.result,
});

export default connect(mapStateToProps)(Home);
