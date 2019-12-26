import {
	signinSuccess,
	signOut,
	burnEverything,
	setAccount,
	signinTokenGen,
	resetError,
	setUnreadCount,
	signupUser_DB,
	updateUser_DB,
} from './actionUser';

import {
	getAnswers,
	giveAnswer,
	calculateRiskScore,
	calculateRiskScoreProgress,
	updateRiskLabel,
} from './actionAnswers';

import {
	getStatus,
	circulateStatus,
} from './actionWhitelist';

import {
	getResults,
	circulateLocalResults,
} from './actionResults';

export {
	//user account ops
	signinSuccess,
	signOut,
	burnEverything,
	setAccount,
	signinTokenGen,
	resetError,
	signupUser_DB,
	updateUser_DB,

	//questionaire functions
	getAnswers,
	giveAnswer,
	calculateRiskScore,
	calculateRiskScoreProgress,

	//get new encrypted results from server
	getResults,
	circulateLocalResults,

	//whitelist
	getStatus,
	circulateStatus,
};
