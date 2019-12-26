import {
	signinSuccess,
	signOut,
	burnEverything,
	setAccount,
	resetError,
	signupUser_DB,
	updateUser_DB
} from './actionUser';

import {
	getAnswers,
	giveAnswer,
	calculateRiskScore,
	calculateRiskScoreProgress
} from './actionAnswers';

import {
	getResults,
	circulateLocalResults
} from './actionResults';

export {
	//user account ops
	signinSuccess,
	signOut,
	burnEverything,
	setAccount,
	resetError,

	//questionaire functions
	getAnswers,
	giveAnswer,
	calculateRiskScore,
	calculateRiskScoreProgress,

	//get new encrypted results from server
	getResults,
	circulateLocalResults
};
