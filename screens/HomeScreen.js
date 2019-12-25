import React from 'react';
import { connect } from 'react-redux';

import { Platform, StyleSheet, Text, TouchableOpacity,
  View, FlatList, Image, ActivityIndicator, Dimensions, 
  ScrollView, ImageBackground } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import * as Permissions from 'expo-permissions';

import { setDefaultScreen } from '../redux/actions';

import ProgressCircle from '../components/ProgressCircle';

import BasicButton from '../components/BasicButton';
import colors from '../constants/Colors';
import i18n from '../constants/Strings';
import mS from '../constants/masterStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';

//redux
import { calculateRiskScore } from '../redux/actions';

class HomeScreen extends React.Component {  

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
          {i18n.t('homescreen_title')}
        </Text>
      ),
    }
  };

  constructor (props) {

    super(props); 

    scrollView : ScrollView;

    const { frs } = this.props.answer;
    const { localResult } = this.props.result;

    this.state = {

      //FRS result and logic
      percentAnswered: (frs.percentAnswered || 0), //0 to 100%
      haveFRS: (frs.haveFRS || false), //is there an FRS number?
      frsLabel_gene: (frs.frsLabel_gene || ''), //e.g. elevated
      frsLabel_lifestyle: (frs.frsLabel_lifestyle || ''), //e.g. elevated
      frsScore_ab: (frs.frsScore_ab || 0),  //e.g. 14.5%
      frsScore_r: (frs.frsScore_r || 0),  //e.g. 1.2
      frsCurrent: (frs.frsCurrent || false), //is the score valid/current?

      //for the FRS progress indicator
      FRScompute_progress: (this.props.answer.FRScompute_progress || 0),
      FRScomputing: (this.props.answer.FRScomputing || false),

      //DNA result and logic
      //if gene_rr = 0.0 no result
      //if gene_bias = 
      //gene_bias: (localResult.gene_bias || 0), //text - e.g. slightly increases
      gene_rr: (Number.parseFloat(localResult.gene_rr).toPrecision(2) || 0.0), //e.g. 1.8
      dnaStatus: (localResult.r_state || 0), //result type
      haveDNA: (localResult.haveDNA || false), //is there a DNA result?

      /* 
      r_state == 0 -> No information - waiting for your dna sample
      r_state == 1 -> Sample received
      r_state == 2 -> Sequencing in progress
      r_state == 3 -> Analyzing your genome 
      r_state == 4 -> Result done - please download -> and the app sets this to state 8 after successful download.
      r_state == 5 -> Result done - please download -> and the app sets this to state 8 after successful download.
      */
    };

  }

  handleClickItem = (page) => {

    if (page === 'RESULTS_FRS') {
      this.props.navigation.navigate('ResultFRS');
    } else if (page === 'GIVE_ANSWERS') {
      this.props.navigation.navigate('Qbasic');
    } else if (page === 'RESULTS_DNA') {
      this.props.navigation.navigate('ResultDNA');
    } else if (page === 'RESULTS_DNA_SHARE') {
      this.props.navigation.navigate('ResultDNAShare');
    } else if (page === 'RESULTS_PREPORT') {
      this.props.navigation.navigate('ResultPreport');
    }
  }

  /*deals with missing config setting in Android, relating to the initial 
  postion of the data in the scrollview. Also deals with iOS without needing 
  the depreciated intialOffset*/
  _onContentSizeChange() {
     //if (__DEV__) console.log('scrolling to:', initialYScroll);
     //this.scrollView.scrollTo({x: 0, y: initialYScroll, animated: false});
  };

  UNSAFE_componentWillReceiveProps(nextProps) {

    const { frs } = nextProps.answer;
    const { localResult } = nextProps.result;

    this.setState({

      percentAnswered: (frs.percentAnswered || 0.0),
      
      frsScore_ab: (frs.frsScore_ab || 0.0),
      frsScore_r: (frs.frsScore_r || 0.0),
      frsLabel_gene: (frs.frsLabel_gene || ''), //e.g. elevated
      frsLabel_lifestyle: (frs.frsLabel_lifestyle || ''), //e.g. elevated
      frsCurrent: (frs.frsCurrent || false), 
      haveFRS: (frs.haveFRS || false),
      
      gene_rr: (Number.parseFloat(localResult.gene_rr).toPrecision(2) || 0.0), //e.g. 1.8
      dnaStatus: (localResult.r_state || 0),
      haveDNA: (localResult.haveDNA || false),
      
      FRScompute_progress: (nextProps.answer.FRScompute_progress || 0),
      FRScomputing: (nextProps.answer.FRScomputing || false),

    });
  }

  handleCalculate = () => {

    const { dispatch } = this.props;
    const { answers, frs } = this.props.answer;
    const { account } = this.props.user;
    const { localResult } = this.props.result;

    dispatch(calculateRiskScore(answers, localResult, account.UUID, account.id));

  }

  scrollToTop = () => {
    if (this.scrollView) {
      //if (__DEV__) console.log('yes, lets scroll')
      //this.scrollView.scrollTo({ y: 0, animated: true });
    }
  }

//scroll to top before mount
//but what if person just goes back to the front page?

  UNSAFE_componentWillMount() {

    //this.props.navigation.setParams({ scrollToTop: this.scrollToTop });
  
  }

  render() {

    const { frsCurrent, percentAnswered, frsScore_ab, frsScore_r, frsLabel_gene, 
            frsLabel_lifestyle, haveFRS, dnaStatus, haveDNA, gene_rr, 
            FRScompute_progress, FRScomputing, positionY } = this.state;
   
    let internet = this.props.user.internet.internet_connected;
    let SMCservers = this.props.user.internet.servers_reachable;

    var haveDetailedDNA = false;

    if (dnaStatus > 3) {
      haveDetailedDNA = true;
    }
    
    if ( haveDetailedDNA ) {

      if (gene_rr === 0) {
        if (__DEV__) console.log('ERROR: should never happen - gene_rr === 0 but haveDetailedDNA === True')
      }
      //if (__DEV__) console.log('Setting gene bias')
      //if (gene_rr === 0)      { gene_bias_text = i18n.t('homescreen_generisk_null')}
      if (                       gene_rr < 0.9) { gene_bias_text = i18n.t('homescreen_generisk_lower')}
      else if (gene_rr >= 0.9 && gene_rr < 1.2) { gene_bias_text = i18n.t('homescreen_generisk_same')}
      else if (gene_rr >= 1.2 && gene_rr < 1.8) { gene_bias_text = i18n.t('homescreen_generisk_higher')}
      else if (gene_rr >= 1.8) { gene_bias_text = i18n.t('homescreen_generisk_sighigher')}
      else { gene_bias_text = '' }
    
      overallScore_ab = (frsScore_ab * gene_rr).toFixed(1);
      overallScore_r  = (frsScore_r  * gene_rr).toFixed(1);

    } else { 
      //we do not have gene_rr data, so use what we have 
      overallScore_ab = frsScore_ab 

    }

    return (

<View style={styles.mainContainer}>

<ScrollView 
  contentContainerStyle={{alignItems: 'center'}}
  showsVerticalScrollIndicator={false}
  overScrollMode={'always'}
  ref={(ref) => this.scrollView = ref}
>

{/*makes sure there is nontrivial scroll magnitude*/}
<View style={{height: 0}}/>

{/********************************************
              Internet Alert
**********************************************/}
{!internet &&
<View style={[styles.shadowBox,{borderColor:colors.BDred, borderWidth: 2}]}>
  <View style={{width: '100%'}}>
    <Text style={styles.boxTitle}>{i18n.t('home_internet_title')}</Text>
    <View style={styles.textBlock}>
      <Text style={mS.smallGrayFP}>{i18n.t('home_internet_text')}</Text>
    </View>
  </View>
</View>
}

{/********************************************
              Server Alert
**********************************************/}
{!SMCservers &&
<View style={[styles.shadowBox,{borderColor:colors.BDred, borderWidth: 2}]}>
  <View style={{width: '100%'}}>
    <Text style={styles.boxTitle}>{i18n.t('home_server_title')}</Text>
    <View style={styles.textBlock}>
      <Text style={mS.smallGrayFP}>{i18n.t('home_server_text')}</Text>
    </View>
  </View>
</View>
}

{/********************************************
      THE FIRST BOX - Summary
**********************************************/}

<View style={styles.shadowBox}>
<View style={{width: '100%'}}>

  <ImageBackground
    source={require('../assets/images/id.png')}
    style={{
      width: '100%', 
      height: 50,
    }}
  >
    <Text style={styles.boxTitle}>{i18n.t('homescreen_summary')}</Text>
  </ImageBackground>

{/*Initial state - no idea about anything*/}
{(!haveFRS && !haveDNA) && 
<View style={styles.textBlock}>
  <Text style={styles.mediumDark}>{i18n.t('homescreen_summary_null')}</Text>
  <Text style={mS.smallGrayFP}>{i18n.t('homescreen_summary_ask')}</Text>
</View>
}

{/*User has not filled out FRS but we have DNA status data or results*/}
{!haveFRS && haveDNA && 
<View style={styles.textBlock}>
  <Text style={mS.smallGrayFP}>
    <Text style={{fontWeight: 'bold'}}>{i18n.t('homescreen_basic_risk')}{` `}</Text>
    {i18n.t('homescreen_summary_risk_ask')}
  </Text>
</View>
}

{/*User has filled out FRS and we have DNA results*/}
{haveDetailedDNA && frsCurrent && haveFRS && percentAnswered == 100 && 
  <View style={styles.textBlock}>
    <Text style={mS.smallGrayFP}>
      <Text style={{fontWeight: 'bold'}}>{i18n.t('homescreen_overall_risk')}{` `}</Text>
      {/*"Overall Risk."*/}
      {i18n.t('homescreen_summary_risk1')}
      {/*"Considering your lifestyle, physiology, and genetics, your overall risk may be"*/}
      {frsLabel_gene == 'low'       && i18n.t('global_low')}
      {frsLabel_gene == 'moderate'  && i18n.t('global_moderate')}
      {frsLabel_gene == 'borderline'&& i18n.t('global_borderline')}
      {frsLabel_gene == 'elevated'  && i18n.t('global_elevated')}
      {frsLabel_gene == 'high'      && i18n.t('global_high')}
      {/*You may have a*/}
      {i18n.t('homescreen_risk2')}
      {/*XXX%*/}
      <Text style={{fontWeight: 'bold'}}>{overallScore_ab}%</Text>{` `}
      {/*risk of a cv event over the next 10 years*/}
      {i18n.t('homescreen_risk3')}{` `}
    </Text>
  </View>
}

{/*this populates the 'basic' risk section - Case == User has filled out FRS*/}
{frsCurrent && haveFRS && percentAnswered == 100 && 
  <View style={styles.textBlock}>
  <Text style={mS.smallGrayFP}>
    <Text style={{fontWeight: 'bold'}}>{i18n.t('homescreen_basic_risk')}{` `}</Text>
    {i18n.t('homescreen_basic_risk1')}
    {frsLabel_lifestyle == 'low'       && i18n.t('global_low')}
    {frsLabel_lifestyle == 'moderate'  && i18n.t('global_moderate')}
    {frsLabel_lifestyle == 'borderline'&& i18n.t('global_borderline')}
    {frsLabel_lifestyle == 'elevated'  && i18n.t('global_elevated')}
    {frsLabel_lifestyle == 'high'      && i18n.t('global_high')}
    {!haveDetailedDNA && i18n.t('homescreen_risk2_short')}
    {!haveDetailedDNA && <Text style={{fontWeight: 'bold'}}>{frsScore_ab}%</Text>}
    {i18n.t('global_dot')}
  </Text>
</View>
}

{/*'User updated the FRS but has not finished all the questions'*/}
{haveFRS && percentAnswered != 100 && 
  <View style={styles.textBlock}>
  <Text style={mS.smallGrayFP}>
    <Text style={{fontWeight: 'bold'}}>{i18n.t('homescreen_basic_risk')}{` `}</Text>
    {i18n.t('homescreen_summary_risk_ask')}
  </Text>
</View>
}

{/*'User has updated FRS but not recalculated and we have DNA status data/result'*/}
{haveFRS && percentAnswered == 100 && !frsCurrent && 
  <View style={styles.textBlock}>
  <Text style={mS.smallGrayFP}>
    <Text style={{fontWeight: 'bold'}}>{i18n.t('homescreen_basic_risk')}{` `}</Text>
    {i18n.t('homescreen_update')}
  </Text>
</View>
}

{/*
The DNA REPORT SENTENCE
*/}

{/*'We have the DNA report'*/}
{haveDetailedDNA && 
  <View style={styles.textBlock}>
  <Text style={mS.smallGrayFP}>
    <Text style={{fontWeight: 'bold'}}>{i18n.t('homescreen_genetic_risk')}{` `}</Text>
    {gene_bias_text}</Text>
</View>
}

{/*'there is a result, but it's not a file, it's just a status update'*/}
{haveDNA && !haveDetailedDNA && dnaStatus < 4 && 
  <View style={styles.textBlock}>
  <Text style={mS.smallGrayFP}>
    <Text style={{fontWeight: 'bold'}}>{i18n.t('homescreen_genetic_risk')}{` `}</Text>
    {i18n.t('homescreen_gene_noresultyet')}
  </Text>
</View>
}

{haveDetailedDNA && !!internet && <View style={{paddingLeft: 10, paddingTop: 20, paddingBottom: 10}}>
<TouchableOpacity 
  hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
  onPress={()=>this.handleClickItem('RESULTS_PREPORT')}>
  <Text style={styles.largeAction}>{i18n.t('homescreen_preport')}</Text>
</TouchableOpacity>
</View>
}

</View>
</View>

{/********************************************
      THE SECOND BOX - FRS
**********************************************/}

<View style={styles.shadowBox}>
<View style={{width: '100%'}}>

  <ImageBackground
    source={require('../assets/images/id.png')}
    style={{
      width: '100%', 
      height: 50,
    }}
  >
    <Text style={styles.boxTitle}>
      {(haveDetailedDNA && frsCurrent) ? i18n.t('homescreen_overall_risk_title') : i18n.t('homescreen_basic_risk_title') }
    </Text>
  </ImageBackground>

<View style={{display: 'flex', flexDirection: 'row'}}>
{/*the left side of the cardio panel*/}
<View style={[styles.cardioLeft, {paddingTop: 20}]}>

{/*'there is an FRS result - allow people to view the result and to update their answers'*/}
{frsCurrent && <View>
<BasicButton 
  text={i18n.t('homescreen_view_result')}
  width="80%" 
  onClick={()=>this.handleClickItem('RESULTS_FRS')}
/>
<TouchableOpacity 
  style={{marginTop: 20}}
  hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
  onPress={()=>this.handleClickItem('GIVE_ANSWERS')}>
  <Text style={styles.largeAction}>{i18n.t('homescreen_update_answer')}</Text>
</TouchableOpacity>
</View>
}

{/*'no FRS result - prompt people to answer questions and to give/update their answers'*/}
{!frsCurrent && (percentAnswered < 100) && <View>
<TouchableOpacity 
  //added this bc in android the sensitive region was very small
  hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
  onPress={()=>this.handleClickItem('GIVE_ANSWERS')}
>
  <Text style={styles.largeAction}>{i18n.t('homescreen_complete_info')}</Text>
</TouchableOpacity>
  <Text style={[mS.smallGrayFP, {marginTop: 5}]}>{i18n.t('homescreen_recommend')}</Text>
</View>
}

{/*'no FRS result - but we have all the data and need to recalculate'*/}
{!frsCurrent && (percentAnswered === 100) && <View>
<Text style={mS.smallGrayFP}>{i18n.t('homescreen_all_question')}</Text>
<View style={{marginTop: 20}}>
  <BasicButton 
    text={i18n.t('homescreen_calculate_risk')}
    width="80%"
    onClick={this.handleCalculate}
    no_internet={!internet || !SMCservers}
    todo={!SMCservers ? i18n.t('home_server_text') : i18n.t('global_internet_text_half') + i18n.t('form_calculate_risk')}
    title={!SMCservers ? i18n.t('home_server_title') : i18n.t('home_internet_title')}
  />
</View>
</View>
}

</View>

{/*the right side of the cardio panel*/}

{/*
there is an FRS result - just display the value
the large gray risk % number with its legend
*/}

<View style={styles.cardioRight}>

{frsCurrent &&
<View>
  <Text style={[styles.gray, {textAlign: 'center', fontWeight: 'bold', fontSize: overallScore_ab >= 10 ? 30 : 38}]}>{overallScore_ab}%</Text>
  <Text style={[mS.smallGrayFP, {textAlign: 'center'}]}>{i18n.t('homescreen_risk_event')}</Text>
</View>
}

{/*'not enough data - display progress answering questions'*/}
{!frsCurrent && !FRScomputing && 
  <View style={styles.circleProgress}>
    <ProgressCircle percent={percentAnswered}>
      <Text style={styles.progressIconNumber}>{`${percentAnswered}%`}</Text>
    </ProgressCircle>
    <View>
      <Text style={styles.progressText}>{i18n.t('homescreen_question_answered')}</Text>
    </View>
  </View>
}

{/*'show progress indicator when calculating risk'*/}
{FRScomputing && 
  <View style={styles.circleProgress}>
    <ProgressCircle percent={FRScompute_progress}>
      <Ionicons name={`ios-cog`} size={35} color={colors.gray}/>
    </ProgressCircle>
    <View>
      {(FRScompute_progress   < 100) && <Text style={styles.progressText}>{i18n.t('homescreen_calculating_risk')}</Text>}
      {(FRScompute_progress === 100) && <Text style={styles.progressText}>{i18n.t('global_Done')}</Text>}
    </View>
</View>
}

</View>
</View>

</View>
</View>

{/********************************************
      START OF THE THIRD BOX - genetics
**********************************************/}

<View style={styles.shadowBox}>
<View style={{width: '100%'}}>

{/*BEGIN GENE BOX TITLE*/}
  <ImageBackground
    source={require('../assets/images/id.png')}
    style={{
      width: '100%', 
      height: 50,
    }}
  >
    <Text style={styles.boxTitle}>{i18n.t('homescreen_genetic_risk_title')}</Text>
  </ImageBackground>

{/*END GENE BOX TITLE*/}

{/*BEGIN GENE STATUS BOX*/}
<View style={styles.textBlock}>

{/*Waiting for blood draw*/}
{haveDNA && (dnaStatus === 0) &&
<Text style={mS.smallGrayFP}>
  <Text style={{fontWeight: 'bold'}}>{i18n.t('result_status')}{` `}</Text>
  {i18n.t('homescreen_gene_waitingforblood')}
</Text>}
{/*Sample in transit*/}
{haveDNA && (dnaStatus === 1) &&
<Text style={mS.smallGrayFP}>
  <Text style={{fontWeight: 'bold'}}>{i18n.t('result_status')}{` `}</Text>
  {i18n.t('homescreen_gene_onmyway')}
</Text>}
{/*Sequencing in progress*/}
{haveDNA && (dnaStatus === 2) &&
<Text style={mS.smallGrayFP}>
  <Text style={{fontWeight: 'bold'}}>{i18n.t('result_status')}{` `}</Text>
  {i18n.t('homescreen_gene_seq_inprog')}
</Text>}
{/*DNA is being analyzed*/}
{haveDNA && (dnaStatus === 3) &&
<Text style={mS.smallGrayFP}>
  <Text style={{fontWeight: 'bold'}}>{i18n.t('result_status')}{` `}</Text>
  {i18n.t('homescreen_gene_analyzing')}
</Text>}
{/*We have the full report*/}
{haveDNA && (dnaStatus > 3) &&
<Text style={mS.smallGrayFP}>
  <Text style={{fontWeight: 'bold'}}>{i18n.t('result_status')}{` `}</Text>
  {i18n.t('homescreen_gene_here')}{` `}{gene_bias_text}
</Text>}
</View>
{/*END GENE STATUS BOX*/}

{/*BEGIN GENE BUTTONS*/}

{haveDetailedDNA && <View style={{
  width: '60%',
  padding: 12,
  paddingTop: 20
}}>
  <BasicButton 
    text={i18n.t('homescreen_view_result')}
    width="80%"
    onClick={()=>this.handleClickItem('RESULTS_DNA')}
  />
</View>
}

{!haveDetailedDNA && 
  <View style={{width: '100%', paddingTop: 12, paddingLeft: 12}}>
<BasicButton 
  text={i18n.t('homescreen_check_status')}
  width="52%"
  onClick={()=>this.handleClickItem('RESULTS_DNA')}
  no_internet = {!internet || !SMCservers}
  todo={!SMCservers ? i18n.t('home_server_text') : i18n.t('global_internet_text_half') + i18n.t('homescreen_check_status_low')}
  title={!SMCservers ? i18n.t('home_server_title') : i18n.t('home_internet_title')}
/>
</View>
}
{/*END GENE BUTTONS*/}

</View>
</View>


{/*ease of use spacer when internet or server error message*/}
{(SMCservers || !internet) &&
  <View style={{height: 80, width: '100%'}}></View>
}

{/*makes sure there is nontrivial scroll magnitude*/}
<View style={{height: 0}}/>

</ScrollView>

</View>);
}}

/*
{ fontWeight: '100' }, // Thin
{ fontWeight: '200' }, // Ultra Light
{ fontWeight: '300' }, // Light
{ fontWeight: '400' }, // Regular
{ fontWeight: '500' }, // Medium
{ fontWeight: '600' }, // Semibold
{ fontWeight: '700' }, // Bold
{ fontWeight: '800' }, // Heavy
{ fontWeight: '900' }, // Black

For Chinese font use:
lineHeight = fontSize + 0.3 * fontSize
*/

const styles = StyleSheet.create({
  boxTitle: {
    fontSize: 19,
    lineHeight: 25,
    paddingTop: 10,
    paddingLeft: 12,
    paddingBottom: 10,
    color: colors.headerFontColor,
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
    color: colors.darkGray,
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
    color: colors.darkGray,
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
    borderColor: colors.homeBoxesLineColor,
    overflow: 'hidden',
  },
  geneStatusBox :{
    paddingTop: 0,
  },
  cardioLeft: {
    width: '60%',
    padding: 12,
  },
  cardioRight: {
    flex: 1, 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
    width: '35%',
    padding: 12,
  },
  circleProgress: {
    justifyContent: 'center',
    alignItems: 'center', 
  },
});

const mapStateToProps = state => ({
  user: state.user,
  answer: state.answer,
  result: state.result,
});

export default connect(mapStateToProps)(HomeScreen);
