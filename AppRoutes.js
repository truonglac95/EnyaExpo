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
import QuestionnaireScreenCardioDemo from './screens/QuestionnaireScreenCardioDemo';
import ResultDNAScreen from './screens/ResultDNAScreen';
import ResultFRSScreen from './screens/ResultFRSScreen';
import TermsAndConditionsScreen_en from './screens/HomeScreen';
import TermsAndConditionsScreen_zh from './screens/HomeScreen';

/* =============================================================================
Screen Names:
============================================================================= */

const SCREEN_NAMES = {
  ACCOUNT_DELETED_SCREEN: "ACCOUNT_DELETED",
  ACCOUNT_DELETE_SCREEN: "ACCOUNT_DELETE",
  ACCOUNT_SCREEN: "ACCOUNT",
  CHAT_SCREEN: "CHAT",
  CODE_SCANNER_SCREEN: "CODE_SCANNER",
  LOGIN_SCREEN: "LOGIN",
  HOME_SCREEN: "HOME",
  PASSWORD_CHANGE_SCREEN: "PASSWORD_CHANGE",
  PASSWORD_FORGOT_SCREEN: "PASSWORD_FORGOT",
  QUESTIONNAIRE_BASIC_SCREEN: "QUESTIONNAIRE_BASIC",
  QUESTIONNAIRE_CARDIO_SCREEN: "QUESTIONNAIRE_CARDIO",
  QUESTIONNAIRE_CARDIO_SCREEN_DEMO: "QUESTIONNAIRE_CARDIO_DEMO",
  RESULT_DNA_SCREEN: "RESULT_DNA",
  RESULT_FRS_SCREEN: "RESULT_FRS",
  TERMS_AND_CONDITIONS_SCREEN_EN: "TERMS_AND_CONDITIONS_EN",
  TERMS_AND_CONDITIONS_SCREEN_ZH: "TERMS_AND_CONDITIONS_ZH",
};

/* =============================================================================
React Navigation Route Config
============================================================================= */

const AppRouteConfig = {
  [SCREEN_NAMES.ACCOUNT_DELETED_SCREEN]: {
    screen: AccountDeletedScreen,
    navigationOptions: {}
  },
  [SCREEN_NAMES.ACCOUNT_DELETE_SCREEN]: {
    screen: AccountDeleteScreen,
    navigationOptions: {}
  },
  [SCREEN_NAMES.ACCOUNT_SCREEN]: {
    screen: AccountScreen,
    navigationOptions: {}
  },
  [SCREEN_NAMES.CHAT_SCREEN]: {
    screen: ChatScreen,
    navigationOptions: {}
  },
  [SCREEN_NAMES.CODE_SCANNER_SCREEN]: {
    screen: CodeScannerScreen,
    navigationOptions: {}
  },
  [SCREEN_NAMES.LOGIN_SCREEN]: {
    screen: LoginScreen,
    navigationOptions: {}
  },
  [SCREEN_NAMES.HOME_SCREEN]: {
    screen: HomeScreen,
    navigationOptions: {}
  },
  [SCREEN_NAMES.PASSWORD_CHANGE_SCREEN]: {
    screen: PasswordChangeScreen,
    navigationOptions: {}
  },
  [SCREEN_NAMES.PASSWORD_FORGOT_SCREEN]: {
    screen: PasswordForgotScreen,
    navigationOptions: {}
  },
  [SCREEN_NAMES.QUESTIONNAIRE_BASIC_SCREEN]: {
    screen: QuestionnaireScreenBasic,
    navigationOptions: {}
  },
  [SCREEN_NAMES.QUESTIONNAIRE_CARDIO_SCREEN]: {
    screen: QuestionnaireScreenCardio,
    navigationOptions: {}
  },
  [SCREEN_NAMES.QUESTIONNAIRE_CARDIO_SCREEN_DEMO]: {
    screen: QuestionnaireScreenCardioDemo,
    navigationOptions: {}
  },
  [SCREEN_NAMES.RESULT_DNA_SCREEN]: {
    screen: ResultDNAScreen,
    navigationOptions: {}
  },
  [SCREEN_NAMES.RESULT_FRS_SCREEN]: {
    screen: ResultFRSScreen,
    navigationOptions: {}
  },
  [SCREEN_NAMES.TERMS_AND_CONDITIONS_SCREEN_EN]: {
    screen: TermsAndConditionsScreen_en,
    navigationOptions: {}
  },
  [SCREEN_NAMES.TERMS_AND_CONDITIONS_SCREEN_ZH]: {
    screen: TermsAndConditionsScreen_zh,
    navigationOptions: {}
  },
};

/* =============================================================================
Export
============================================================================= */

export { SCREEN_NAMES };

export default AppRouteConfig;
