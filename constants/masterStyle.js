import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';

var screenW = Dimensions.get('window').width

var c = {
  white: '#FFFFFF',
  lightGray: '#CCCCCC',
  gray: '#707070',
  darkGray: '#404040',
  lightBlue: '#EEF2F9',
  darkBlue: '#33337F',
  red: '#BF1A21',
  buttonColorText: '#33337F',
};

exports.mC = c;

exports.mS = StyleSheet.create({

  basicContainer: {paddingTop: 120,paddingLeft: 30,paddingRight: 30},
  boxTitle: {fontSize: 19,color: c.darkBlue,paddingTop: 10,paddingLeft: 12,paddingBottom: 10},

  buttonContainer: {width: '80%',alignItems: 'center',justifyContent: 'center',marginTop: 40},

  containerCenterA: {flex: 1,flexDirection: 'column',alignItems: 'center',backgroundColor: c.lightBlue},
  containerMain: {   flex: 1,flexDirection: 'column',alignItems: 'center',backgroundColor: c.lightBlue, justifyContent: 'flex-start'},
  
  containerKAV: {    flex: 1,flexDirection: 'column',alignItems: 'center',justifyContent: 'center'},
  containerCenter: { flex: 1,flexDirection: 'column',alignItems: 'center',justifyContent: 'center',backgroundColor: c.white},
  containerProgress:{flex: 1,                        alignItems: 'center',justifyContent: 'center',marginTop: 300,marginLeft: 50,marginRight: 50},

  contentContainerSV: {alignItems: 'center'},
  circleProgress: {justifyContent: 'center',alignItems: 'center'},

  tabText:          {fontSize: 12,                                     marginLeft: 'auto', marginRight: 'auto'},
  smallGray:        {fontSize: 14,color: c.gray,     fontWeight: '400'},
  smallGrayQ:       {fontSize: 14,color: c.gray      },
  smallGrayBold:    {fontSize: 14,color: c.gray,     fontWeight: '700'},
  progressText:     {fontSize: 14,color: c.gray,     fontWeight: '400',marginTop:10,height: 40, textAlign: 'center'},
  descriptionSmall: {fontSize: 15,color: c.gray      },
  mediumDark:       {fontSize: 16,color: c.darkGray, fontWeight: '400'},
  textInfoLogin:    {fontSize: 16,color: c.darkGray  },
  largeAction:      {fontSize: 16,color: c.darkBlue, fontWeight: '500'},
  subHeadR:         {fontSize: 16,color: c.gray,     fontWeight: 'bold',marginRight:5,marginTop:10},
  tagTextVP:        {fontSize: 16,color: c.gray,     fontWeight: 'normal',textAlign:'center',marginTop: 10,marginBottom: 20,marginLeft: 20,marginRight: 20},
  progressIcon:     {fontSize: 16,color: c.gray,     fontWeight: '400',marginTop: 2,marginLeft: 1},
  textQ:            {fontSize: 18,color: c.darkGray, fontWeight: 'bold'},
  textUUID:         {fontSize: 18,color: c.darkGray, fontWeight: 'normal',textAlign:'left',justifyContent:'center'},
  screenTitle:      {fontSize: 19,color: c.darkBlue,                    marginRight: 'auto',marginLeft: 'auto',textAlign: 'center',alignSelf: 'center'},
  description:      {fontSize: 20,color: c.gray      },
  titleTextVP:      {fontSize: 26,color: c.darkGray, fontWeight: '600', alignItems: 'center',textAlign: 'center'},

  //grey dots for the value prop pages
  dot: {width: 8,height: 8,borderRadius: 4,marginLeft: 5,marginRight: 5,backgroundColor: c.lightGray},

  loadingContainerR: { flex: 1, justifyContent: 'center', alignItems: 'center'},

  marTop20: {marginTop: 20,marginLeft: 'auto',marginRight: 'auto'},
  marTop40: {marginTop: 40,marginLeft: 'auto',marginRight: 'auto'},
  msgBoxVP: {height: 180,width: '85%',textAlign: 'center'},

  row: {position: 'absolute',left: 0,top: 100,margin: 20},

  sliderVP: {display: 'flex',marginBottom: 15,flexDirection: 'row'},

  shadowBox: {     display:'flex',flexDirection:'column',width: screenW-25,marginTop:13,backgroundColor: c.white,borderRadius: 9,borderWidth: 1,paddingBottom: 10,borderColor: c.darkBlue,overflow: 'hidden'},
  shadowBoxClear: {display:'flex',flexDirection:'column',width: screenW-25,marginTop:13,justifyContent: 'center',alignItems: 'center',padding: 10,height: 100},

  smc: {width: '60%',padding: 12,paddingTop: 20},
  smcRight: {flex: 1,flexDirection: 'column',justifyContent: 'center',alignItems: 'center',width: '35%',padding: 12},

  topLogo: {width:70,height:70,marginBottom: 30},
  textBlock: {paddingTop: 10, paddingLeft: 10, paddingRight: 10},
  valuePropVP: {alignItems: 'center',marginBottom: 15,width: 300,height: 300},

  //Questions
  rowQ: {display: 'flex',width: screenW * 0.85,height: Platform.OS === 'ios' ? 60 : 'auto',flexDirection: 'row',
    alignItems:'center',borderBottomWidth: 1,borderBottomColor: '#EEEEEE',
    paddingTop: 5,paddingBottom: 5,paddingLeft: 15,paddingRight: 15},
  labelQ: {width: 0.35 * screenW,marginRight: 10},
  shadowBoxQ: {display:'flex',flexDirection:'column',width: screenW-25,marginTop:13,
    backgroundColor: c.white,borderRadius: 9,borderWidth: 1,paddingBottom: 10,
    borderColor: c.darkBlue,overflow: 'hidden',justifyContent: 'center',
    alignItems: 'flex-start',padding: 10},


  //SMC Report
  containerReportSMC: {left: 0,top: 0,marginLeft: 10,marginRight: 10},
  rowTopSMC: {marginTop: 30, marginBottom: 30, alignItems: 'center', justifyContent: 'center'},
  rowSMC: {   marginTop: 10, marginBottom: 20},
  textSMC:  {fontSize: 15, fontWeight: 'normal', color: c.gray},
  scoreSMC: {fontSize: 33, fontWeight: 'bold'},
  titleSMC: {fontSize: 18, fontWeight: 'bold'  , color: c.darkGray, marginRight:5, marginBottom: 10},


});