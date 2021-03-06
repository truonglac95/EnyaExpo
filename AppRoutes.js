import Home from './screens/Home';

import Account from './screens/Account';
import AccountDelete from './screens/AccountDelete';
import AccountDeleted from './screens/AccountDeleted';

import Questionnaire from './screens/Questionnaire';

import ResultSC from './screens/ResultSC';
import FHEKeyGen from './screens/FHEKeyGen';

/* =============================================================================
Screen Names:
============================================================================= */

const SCREEN_NAMES = {
  HOME: "HOME",
  ACCOUNT: "ACCOUNT",
  ACCOUNT_DELETE: "ACCOUNT_DELETE",
  ACCOUNT_DELETED: "ACCOUNT_DELETED",
  QUESTIONNAIRE: "QUESTIONNAIRE",
  RESULT_SC: "RESULT_SC",
  FHE_GEN: "FHE_GEN"
};

/* =============================================================================
React Navigation Route Config
============================================================================= */

const AppRouteConfig = {
  [SCREEN_NAMES.ACCOUNT]: {
    screen: Account,
    navigationOptions: {}
  },
  [SCREEN_NAMES.ACCOUNT_DELETE]: {
    screen: AccountDelete,
    navigationOptions: {}
  },
  [SCREEN_NAMES.ACCOUNT_DELETED]: {
    screen: AccountDeleted,
    navigationOptions: {}
  },
  [SCREEN_NAMES.FHE_GEN]: {
    screen: FHEKeyGen,
    navigationOptions: {}
  },
  [SCREEN_NAMES.QUESTIONNAIRE]: {
    screen: Questionnaire,
    navigationOptions: {}
  },
  [SCREEN_NAMES.RESULT_SC]: {
    screen: ResultSC,
    navigationOptions: {}
  },
};

/* =============================================================================
Export
============================================================================= */

export { SCREEN_NAMES };

export default AppRouteConfig;
