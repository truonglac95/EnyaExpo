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
	FHEKeyGen,
	secureCompute,
	secureComputeProgress
} from './actionAnswers';

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
	FHEKeyGen,
	secureCompute,
	secureComputeProgress
};
