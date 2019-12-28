import Account from './screens/Account';
import AccountDelete from './screens/AccountDelete';
import AccountDeleted from './screens/AccountDeleted';

import CodeScanner from './screens/CodeScanner';

import Home from './screens/Home';

import Questionnaire from './screens/Questionnaire';
import ResultSMC from './screens/ResultSMC';
import Result from './screens/Result';

/* =============================================================================
Screen Names:
============================================================================= */

const SCREEN_NAMES = {
  ACCOUNT_DELETED_: "ACCOUNT_DELETED",
  ACCOUNT_DELETE: "ACCOUNT_DELETE",
  ACCOUNT: "ACCOUNT",
  CODE_SCANNER: "CODE_SCANNER",
  HOME: "HOME",
  QUESTIONNAIRE: "QUESTIONNAIRE",
  RESULT_SMC: "RESULT_SMC",
  RESULT: "RESULT",
};

/* =============================================================================
React Navigation Route Config
============================================================================= */

const AppRouteConfig = {
  [SCREEN_NAMES.ACCOUNT_DELETED]: {
    screen: AccountDeleted,
    navigationOptions: {}
  },
  [SCREEN_NAMES.ACCOUNT_DELETE]: {
    screen: AccountDelete,
    navigationOptions: {}
  },
  [SCREEN_NAMES.ACCOUNT]: {
    screen: Account,
    navigationOptions: {}
  },
  [SCREEN_NAMES.CODE_SCANNER]: {
    screen: CodeScanner,
    navigationOptions: {}
  },
  [SCREEN_NAMES.HOME]: {
    screen: Home,
    navigationOptions: {}
  },
  [SCREEN_NAMES.QUESTIONNAIRE]: {
    screen: Questionnaire,
    navigationOptions: {}
  },
  [SCREEN_NAMES.RESULT]: {
    screen: Result,
    navigationOptions: {}
  },
  [SCREEN_NAMES.RESULT_SMC]: {
    screen: ResultSMC,
    navigationOptions: {}
  },
};

/* =============================================================================
Export
============================================================================= */

export { SCREEN_NAMES };

export default AppRouteConfig;
