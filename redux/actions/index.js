import {
	signinSuccess,
	signOut,
	burnEverything,
	setAccount,
	resetError
} from './actionUser';

import {
	getAnswers,
	giveAnswer,
	secureCompute,
	secureComputeProgress
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
	secureCompute,
	secureComputeProgress,

	//get new encrypted results from server
	getResults,
	circulateLocalResults
};
