import React from "react";

import AccountDeletedScreen from './screens/AccountDeletedScreen';
import AccountDeleteScreen from './screens/AccountDeleteScreen';
import AccountScreen from './screens/AccountScreen';
import ChatScreen from './screens/ChatScreen';
import CodeScannerScreen from './screens/CodeScannerScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import PasswordChangeScreen from './screens/PasswordChangeScreen';
import PasswordForgotScreen from './screens/PasswordForgotScreen';
import QuestionnaireScreenBasic from './screens/QuestionnaireScreenBasic';
import QuestionnaireScreenCardio from './screens/QuestionnaireScreenCardio';
import ResultDNAScreen from './screens/ResultDNAScreen';
import ResultFRSScreen from './screens/ResultFRSScreen';
import TermsAndConditionsScreen_en from './screens/TermsAndConditionsScreen_en';
import TermsAndConditionsScreen_zh from './screens/TermsAndConditionsScreen_zh';
import { SCREEN_NAMES } from "./AppRoutes";

/** =======================================================
 * Stargazer Route Config
 * ========================================================
 */

const StargazerRouteConfig = [
  {
    name: "Account Deleted Screen",
    screenName: SCREEN_NAMES.ACCOUNT_DELETED_SCREEN,
    screen: () => <AccountDeletedScreen />
  },
  {
    name: "Account Delete Screen",
    screenName: SCREEN_NAMES.ACCOUNT_DELETE_SCREEN,
    screen: () => <AccountDeleteScreen />
  },
  {
    name: "Account Screen",
    screenName: SCREEN_NAMES.ACCOUNT_SCREEN,
    screen: () => <AccountScreen />
  },
  {
    name: "Code Scanner Screen",
    screenName: SCREEN_NAMES.CODE_SCANNER_SCREEN,
    screen: () => <CodeScannerScreen />
  },
  {
    name: "Home Screen",
    screenName: SCREEN_NAMES.HOME_SCREEN,
    screen: () => <HomeScreen />
  },
  {
    name: "Login Screen",
    screenName: SCREEN_NAMES.LOGIN_SCREEN,
    screen: () => <LoginScreen />
  },
  {
    name: "Password Change Screen",
    screenName: SCREEN_NAMES.PASSWORD_CHANGE_SCREEN,
    screen: () => <PasswordChangeScreen />
  },
  {
    name: "Password Forgot Screen",
    screenName: SCREEN_NAMES.PASSWORD_FORGOT_SCREEN,
    screen: () => <PasswordForgotScreen />
  },
  {
    name: "Questionnaire Basic Screen",
    screenName: SCREEN_NAMES.QUESTIONNAIRE_BASIC_SCREEN,
    screen: () => <QuestionnaireScreenBasic />
  },
  {
    name: "Questionnaire Cardio Screen",
    screenName: SCREEN_NAMES.QUESTIONNAIRE_CARDIO_SCREEN,
    screen: () => <QuestionnaireScreenCardio />
  },
  {
    name: "Terms & Conditions Screen En",
    screenName: SCREEN_NAMES.TERMS_AND_CONDITIONS_SCREEN_EN,
    screen: () => <TermsAndConditionsScreen_en />
  },
  {
    name: "Terms & Conditions Screen Zh",
    screenName: SCREEN_NAMES.TERMS_AND_CONDITIONS_SCREEN_ZH,
    screen: () => <TermsAndConditionsScreen_zh />
  },
  {
    name: "Result DNA Screen",
    screenName: SCREEN_NAMES.RESULT_DNA_SCREEN,
    screen: () => <ResultDNAScreen />
  },
  {
    name: "Result FRS Screen",
    screenName: SCREEN_NAMES.RESULT_FRS_SCREEN,
    screen: () => <ResultFRSScreen />
  },
  /* {
    name: "Chat Screen",
    screenName: SCREEN_NAMES.CHAT_SCREEN,
    screen: () => <ChatScreen />
  }, */
];

export default StargazerRouteConfig;
