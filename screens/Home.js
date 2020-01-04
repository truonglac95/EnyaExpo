import React from 'react';
import { connect } from 'react-redux';

import { Platform, StyleSheet, Text, TouchableOpacity,
  View, FlatList, Image, ActivityIndicator, Dimensions, 
  ScrollView, ImageBackground } from 'react-native';

import ProgressCircle from '../components/ProgressCircle';
import BasicButton from '../components/BasicButton';
import colors from '../constants/Colors';
import mS from '../constants/masterStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { secureCompute, getResults, getAnswers } from '../redux/actions';

class Home extends React.Component {  

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => (<Text style={mS.screenTitle}>{'Enya.ai Demonstrator'}</Text>),
    }
  }

  constructor (props) {

    super(props); 

    const { smc } = this.props.answer;

    this.state = {
      percentAnswered: (smc.percentAnswered || 0), //0 to 100
      result: (smc.result || 0.0), //e.g. 14.5
      current: (smc.current || false), //is the score valid/current?

      SMC_compute_progress: (this.props.answer.SMC_compute_progress || 0),
      SMC_computing: (this.props.answer.SMC_computing || false),
      
      haveReport: (this.props.result.downloaded || false),
      downloadingReport: false,
    };

  }

  handleClickItem = (page) => {

    if (page === 'RESULT_SMC') {
      this.props.navigation.navigate('ResultSMC');
    } else if (page === 'GIVE_ANSWERS') {
      this.props.navigation.navigate('Questionnaire');
    } else if (page === 'REPORT_SEE') {
      this.props.navigation.navigate('Result');
    } else if (page === 'REPORT_GET') {
      if (__DEV__) console.log('Getting report')
      this.setState({downloadingReport: true});
      this.props.dispatch(getResults(this.props.user.account.UUID));
    }

  }

  UNSAFE_componentWillReceiveProps(nextProps) {

    const { smc } = nextProps.answer;

    this.setState({
      percentAnswered: (smc.percentAnswered || 0.0),
      result: (smc.result || 0.0),
      current: (smc.current || false),

      SMC_compute_progress: (nextProps.answer.SMC_compute_progress || 0),
      SMC_computing: (nextProps.answer.SMC_computing || false),

      haveReport: (nextProps.result.downloaded || false)
    });

  }

  handleCalculate = () => {

    const { dispatch } = this.props;
    const { answers } = this.props.answer;
    dispatch( secureCompute(answers) );

  }

  render() {

    const { current, percentAnswered, result, SMC_compute_progress, 
      SMC_computing, downloadingReport, haveReport } = this.state;
    
    var score = parseFloat(result).toFixed(1);

    return (

<View style={styles.mainContainer}>

<ScrollView 
  contentContainerStyle={{alignItems: 'center'}}
  showsVerticalScrollIndicator={false}
  overScrollMode={'always'}
>

{/********************************************
      THE FIRST BOX - Summary
**********************************************/}

<View style={styles.shadowBox}>
<View style={{width: '100%'}}>

<ImageBackground
  source={require('../assets/images/id.png')}
  style={{width: '100%', height: 50}}
>
  <Text style={styles.boxTitle}>{'Overview'}</Text>
</ImageBackground>

{!current &&
<View style={styles.textBlock}>
<Text style={styles.mediumDark}>{'We cannot calculate your score yet.'}</Text>
<Text style={mS.smallGrayFP}>{'Please answer the questions about you. With that \
information, we can VALUE_PROP. Lorem ipsum dolor sit amet, consectetur adipiscing \
elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}</Text>
</View>
}
{current && (score < 10) &&
<View style={styles.textBlock}>
<Text style={styles.mediumDark}>{'We have securely calculated your score.'}</Text>
<Text style={mS.smallGrayFP}>{'\nYour score is '}
<Text style={[mS.smallGrayFP, {fontWeight: 'bold'}]}>{score}%</Text>
{'. Since your score is below 10, lorem ipsum dolor sit amet, \
consectetur adipiscing elit, sed do eiusmod tempor.'}</Text>
</View>
}
{current && (score > 10) &&
<View style={styles.textBlock}>
<Text style={styles.mediumDark}>{'We have securely calculated your score.'}</Text>
<Text style={mS.smallGrayFP}>{'\nYour score is '}
<Text style={[mS.smallGrayFP, {fontWeight: 'bold'}]}>{score}%</Text>
{'. Since your score is above 10, lorem ipsum dolor sit amet, \
consectetur adipiscing elit, sed do eiusmod tempor.'}</Text>
</View>
}

</View>
</View>

{/********************************************
      THE SECOND BOX - SMC
**********************************************/}

<View style={styles.shadowBox}>
<View style={{width: '100%'}}>

<ImageBackground
  source={require('../assets/images/id.png')}
  style={{width: '100%', height: 50}}
>
  <Text style={styles.boxTitle}>{'Secure Computation'}</Text>
</ImageBackground>

<View style={{display: 'flex', flexDirection: 'row'}}>
<View style={styles.smc}>

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
  <Text style={styles.largeAction}>{'Update Answers'}</Text>
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
  <Text style={styles.largeAction}>{'Complete my information'}</Text>
</TouchableOpacity>
<Text style={[mS.smallGrayFP, {marginTop: 5}]}>{'to get personalized recommendations.'}</Text>
</View>
}

{/*'no SMC result - but we have all the data and need to recalculate'*/}
{!current && (percentAnswered === 100) && 
<View>
<Text style={mS.smallGrayFP}>{'All questions answered'}</Text>
<View style={{marginTop: 20}}>
  <BasicButton 
    text={'Calculate Score'}
    width="80%"
    onClick={this.handleCalculate}
  />
</View>
</View>
}

</View>

{/*the right side of the SMC panel*/}

<View style={styles.smcRight}>

{current &&
<View>
  <Text style={[styles.gray, {textAlign: 'center', fontWeight: 'bold', fontSize: 30}]}>{score}%</Text>
  <Text style={[mS.smallGrayFP, {textAlign: 'center'}]}>{'Your Score'}</Text>
</View>
}

{/*'not enough data - display progress answering questions'*/}
{!current && !SMC_computing && 
  <View style={styles.circleProgress}>
    <ProgressCircle percent={percentAnswered}>
      <Text style={styles.progressIconNumber}>{`${percentAnswered}%`}</Text>
    </ProgressCircle>
    <View>
      <Text style={styles.progressText}>{'Questions Answered'}</Text>
    </View>
  </View>
}

{/*'show progress indicator when calculating score'*/}
{SMC_computing && 
  <View style={styles.circleProgress}>
    <ProgressCircle percent={SMC_compute_progress}>
      <Ionicons name={`ios-cog`} size={35} color={colors.gray} style={{paddingTop:2,paddingLeft:0}}/>
    </ProgressCircle>
    <View>
      {(SMC_compute_progress   < 100) && <Text style={styles.progressText}>{'Calculating Score'}</Text>}
      {(SMC_compute_progress === 100) && <Text style={styles.progressText}>{'Done'}</Text>}
    </View>
  </View>
}

</View>
</View>

</View>
</View>

{/********************************************
  THIRD BOX - Secure Report Delivery
**********************************************/}

<View style={styles.shadowBox}>
<View style={{width: '100%'}}>

<ImageBackground
  source={require('../assets/images/id.png')}
  style={{width: '100%', height: 50}}
>
  <Text style={styles.boxTitle}>{'Secure Report Delivery'}</Text>
</ImageBackground>

<View style={styles.textBlock}>
<Text style={mS.smallGrayFP}>
  <Text style={{fontWeight: 'bold'}}>{'Status:'}</Text>
  {' Your genotyping and microbiome analysis have been completed!'}
</Text>
</View>

{/*BEGIN REPORT BUTTONS*/}

{haveReport &&
<View style={styles.smc}>
  <BasicButton 
    text={'View Report'}
    width="80%"
    onClick={()=>this.handleClickItem('REPORT_SEE')}
  />
</View>
}

{!haveReport && !downloadingReport &&
<View style={styles.smc}>
  <BasicButton 
    text={'Download Report'}
    width="80%"
    onClick={()=>this.handleClickItem('REPORT_GET')}
  />
</View>
}

{!haveReport && downloadingReport &&
<View style={[styles.smc, {height: 72}]}>
  <ActivityIndicator size="large" color='#33337F'/>
</View>
}

</View>
</View>

</ScrollView>

</View>);
}}

const styles = StyleSheet.create({
  boxTitle: {
    fontSize: 19,
    lineHeight: 25,
    paddingTop: 10,
    paddingLeft: 12,
    paddingBottom: 10,
    color: '#33337F',
    fontFamily: colors.headerFont,
  },
  textBlock: {
    paddingTop: 10, 
    paddingLeft: 10, 
    paddingRight: 10, 
  },
  //the blue "Update my answers text"
  largeAction: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500', // Regular
    color: colors.buttonColorText,
  },
  //for most of the text
  smallGray: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '400', // Regular
    color: colors.gray,
  },
  smallGrayBold: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '700', // Bold
    color: colors.gray,
  },
  //subheadings
  mediumDark:{
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400', // Regular
    color: '#404040',
  },
  mediumSize: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400', // Regular
    color: colors.gray,
  },
  progressIconNumber: {
    marginTop: 2, 
    marginLeft: 1, 
    fontSize: 16, 
    fontWeight: '400', 
    color: colors.gray,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '400', 
    marginTop: 10,
    lineHeight: 20, 
    textAlign: 'center',
    color: colors.gray,
    height: 40,
    //don't change otherwise the progress indicator 
    //text jumps when the result is done, since the legends 
    //go from two lines to one line 
  },
  gray: {
    color: colors.gray,
  },
  darkGray: {
    color: '#404040',
  },
  mainContainer: {
    flex: 1, 
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#EEF2F9',
  },
  contentContainerSV: {
    alignItems: 'center',
  },
  shadowBox: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: '98%',
    marginTop: 13, //spacing between boxes
    borderRadius: 9,
    borderWidth: 1,
    paddingBottom: 10, 
    borderColor: '#33337F',
    overflow: 'hidden'
  },
  geneStatusBox :{
    paddingTop: 0,
  },
  smc: {
    width: '60%',
    padding: 12,
    paddingTop: 20
  },
  smcRight: {
    flex: 1, 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
    width: '35%',
    padding: 12
  },
  circleProgress: {
    justifyContent: 'center',
    alignItems: 'center' 
  }
});

const mapStateToProps = state => ({
  user: state.user,
  answer: state.answer,
  result: state.result,
});

export default connect(mapStateToProps)(Home);
