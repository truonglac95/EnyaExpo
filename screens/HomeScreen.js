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
          marginLeft: 'auto', 
          marginRight: 'auto',
          textAlign: 'center',
          alignSelf: 'center',
        }}>
          {'Enya.ai Demonstrator'}
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
    }
  }

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

  render() {

    const { frsCurrent, percentAnswered, frsScore_ab, frsScore_r, frsLabel_gene, 
            frsLabel_lifestyle, haveFRS, dnaStatus, haveDNA, gene_rr, 
            FRScompute_progress, FRScomputing, positionY } = this.state;

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
    style={{
      width: '100%', 
      height: 50,
    }}
  >
    <Text style={styles.boxTitle}>{i18n.t('homescreen_summary')}</Text>
  </ImageBackground>

<View style={styles.textBlock}>
  <Text style={styles.mediumDark}>{'We cannot calulate your score yet.'}</Text>
  <Text style={mS.smallGrayFP}>{'Please answer the questions about you. With that information, we can VALUE_PROP_HERE (match/score/estimate).'}</Text>
</View>

</View>
</View>

{/********************************************
      THE SECOND BOX - SMC
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
      {'Secure Computation'}
    </Text>
  </ImageBackground>

<View style={{display: 'flex', flexDirection: 'row'}}>
<View style={[styles.cardioLeft, {paddingTop: 20}]}>

{/*'there is an SMC result - allow people to view the result and to update their answers'*/}
{frsCurrent && <View>
<BasicButton 
  text={i18n.t('View Result')}
  width="80%" 
  onClick={()=>this.handleClickItem('RESULTS_FRS')}
/>
<TouchableOpacity 
  style={{marginTop: 20}}
  hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
  onPress={()=>this.handleClickItem('GIVE_ANSWERS')}>
  <Text style={styles.largeAction}>{'Update Answers'}</Text>
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
  <Text style={styles.largeAction}>{'Complete my information'}</Text>
</TouchableOpacity>
  <Text style={[mS.smallGrayFP, {marginTop: 5}]}>{i18n.t('homescreen_recommend')}</Text>
</View>
}

{/*'no FRS result - but we have all the data and need to recalculate'*/}
{!frsCurrent && (percentAnswered === 100) && <View>
<Text style={mS.smallGrayFP}>{i18n.t('homescreen_all_question')}</Text>
<View style={{marginTop: 20}}>
  <BasicButton 
    text={'Calculate Risk'}
    width="80%"
    onClick={this.handleCalculate}
  />
</View>
</View>
}

</View>

{/*the right side of the cardio panel*/}

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
      START OF THE THIRD BOX - Secure Delivery
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
    <Text style={styles.boxTitle}>{'Secure Delivery'}</Text>
  </ImageBackground>

{/*END GENE BOX TITLE*/}

{/*BEGIN GENE STATUS BOX*/}
<View style={styles.textBlock}>

{/*We have the full report*/}
{haveDNA && (dnaStatus > 3) &&
<Text style={mS.smallGrayFP}>
  <Text style={{fontWeight: 'bold'}}>{i18n.t('result_status')}{` `}</Text>
  {i18n.t('homescreen_gene_here')}{` `}{gene_bias_text}
</Text>}
</View>
{/*END GENE STATUS BOX*/}

{/*BEGIN GENE BUTTONS*/}

<View style={{
  width: '60%',
  padding: 12,
  paddingTop: 20
}}>
  <BasicButton 
    text={'View Results'}
    width="80%"
    onClick={()=>this.handleClickItem('RESULTS_DNA')}
  />
</View>

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
