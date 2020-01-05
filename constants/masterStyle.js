import React from 'react';
import { StyleSheet } from 'react-native';
import colors from '../constants/Colors';

module.exports = StyleSheet.create({
  boxTitle: {
    fontSize: 19,
    lineHeight: 25,
    color: '#33337F',
    paddingTop: 10,
    paddingLeft: 12,
    paddingBottom: 10,
  },
  //containerCenter: {
  //  flex: 1,
  //  flexDirection: 'column',
  //  alignItems: 'center',
  //  backgroundColor: '#EEF2F9',
  //},
  basicContainer: {
    paddingTop: 120,
    paddingLeft: 30,
    paddingRight: 30,
  },
  containerKAV: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerCenter: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  containerProgress: {
    marginTop: 300,
    marginLeft: 50,
    marginRight: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //for things like "error - passwords don't match"
  errorText: {
    flex: 1, 
    flexWrap: 'wrap',
    textAlign: 'center',
  	fontSize: 15,
  	fontWeight: '400',
  	color: '#404040',
	},
  //same as the error text but not red
  forgot: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '400',
    color: colors.buttonColorText,
  },
  //the box that holds error or informational messages
	errorBox: {
  	height: 50,
    flexDirection:'row',
    marginTop:20,
    width: '84%',
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
	},
	marTop20: {
  	marginTop: 20,
  	marginLeft: 'auto',
  	marginRight: 'auto',
	},
  marTop40: {
    marginTop: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
	description: {
  	fontSize: 20,
    color: '#404040',
  },
  descriptionSmall: {
    fontSize: 15,
    lineHeight: 20, // support Chinese text
    color: '#404040',
  },
  //generalized informational text relating to login, delete, etc
  textInfoLogin: {
    fontSize: 16,
    lineHeight: 22,
    color: '#404040',
  },
  //used in the account page - 
  buttonContainer: {
    width: '80%',
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordRow:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '84%',
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  topLogo: {
    width: 70,
    height: 70,
    //marginTop: 100,
    marginBottom: 30,
  },
  valuePropVP: {
    alignItems: 'center',
    marginBottom: 15,
    width: 300,
    height: 300,
  },
  msgBoxVP: {
    height: 180,
    width: '85%',
    textAlign: 'center',
  },
  titleTextVP: {
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: '600', 
    fontSize: 26,
    color: '#404040',
  },
  tagTextVP: {
    textAlign: 'center',
    fontWeight: 'normal',
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 16,
    color: colors.gray,
    lineHeight: 20,
  },
  sliderVP: {
    display: 'flex',
    marginBottom: 15,
    flexDirection: 'row',
  },
  smallGrayFP: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '400', // Regular
    color: colors.gray,
  },
  smallGrayBoldFP: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '700', // Bold
    color: colors.gray,
  },
  mediumDarkFP:{
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400', // Regular
    color: '#404040',
  },
  mediumSizeFP: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400', // Regular
    color: colors.gray,
  },
  screenTitle: {
    fontSize: 19,
    color: '#33337F',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    alignSelf: 'center',
  },
  textUUID: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'normal',
    color: '#404040',
    textAlign:'left',
    justifyContent:'center',
  },
  shadowBox: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    width: '96%',
    marginTop: 13,
    borderRadius: 9,
    borderWidth: 1,
    paddingBottom: 10, 
    borderColor: '#33337F',
    overflow: 'hidden',
  },
  row: {
    position: 'absolute',
    left: 0,
    top: 100,
    margin: 20,
  },
});