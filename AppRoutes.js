import AccountDeletedScreen from './screens/AccountDeletedScreen';
import AccountDeleteScreen from './screens/AccountDeleteScreen';
import AccountScreen from './screens/AccountScreen';
import CodeScannerScreen from './screens/CodeScannerScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import QuestionnaireScreenBasic from './screens/QuestionnaireScreenBasic';
import QuestionnaireScreenCardio from './screens/QuestionnaireScreenCardio';
import ResultDNAScreen from './screens/ResultDNAScreen';
import ResultFRSScreen from './screens/ResultFRSScreen';

/* =============================================================================
Screen Names:
============================================================================= */

const SCREEN_NAMES = {
  ACCOUNT_DELETED_SCREEN: "ACCOUNT_DELETED",
  ACCOUNT_DELETE_SCREEN: "ACCOUNT_DELETE",
  ACCOUNT_SCREEN: "ACCOUNT",
  CODE_SCANNER_SCREEN: "CODE_SCANNER",
  LOGIN_SCREEN: "LOGIN",
  HOME_SCREEN: "HOME",
  QUESTIONNAIRE_BASIC_SCREEN: "QUESTIONNAIRE_BASIC",
  QUESTIONNAIRE_CARDIO_SCREEN: "QUESTIONNAIRE_CARDIO",
  RESULT_DNA_SCREEN: "RESULT_DNA",
  RESULT_FRS_SCREEN: "RESULT_FRS",
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
  [SCREEN_NAMES.QUESTIONNAIRE_BASIC_SCREEN]: {
    screen: QuestionnaireScreenBasic,
    navigationOptions: {}
  },
  [SCREEN_NAMES.QUESTIONNAIRE_CARDIO_SCREEN]: {
    screen: QuestionnaireScreenCardio,
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
};

/* =============================================================================
Export
============================================================================= */

export { SCREEN_NAMES };

export default AppRouteConfig;
