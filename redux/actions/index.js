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
	receiveNotification,
	shareDNA,
	internetStatus,
	getSharingState,
	sbConnected,
	preport,
	getPreportState,
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
	circulateStatus, /*not sure this is needed*/
} from './actionWhitelist';

import {
	getResults,
	setResultDownloadFlag,
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
	setUnreadCount,
	signupUser_DB,
	updateUser_DB,
	receiveNotification,
	sbConnected,
	internetStatus,
	shareDNA,
	getSharingState,
	preport,
	getPreportState,

	//questionaire functions
	getAnswers,
	giveAnswer,
	calculateRiskScore,
	calculateRiskScoreProgress,
	updateRiskLabel,

	//get new encrypted results from server
	getResults,
	setResultDownloadFlag,
	circulateLocalResults,

	//whitelist
	getStatus,
	circulateStatus,
};
