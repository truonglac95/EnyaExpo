import {
	signinSuccess,
	signOut,
	burnEverything,
	setAccount,
	resetError
} from './actionUser';

import {
	getAnswers,
	giveAnswer
} from './actionAnswer';

import {
	secureComputeSMC,
	secureComputeFHEBuffered,
	secureComputeFHESimple,
	secureCompute,
	secureComputeProgress,
	secureComputeInvalidate
} from './actionCompute';

import {
	FHEKeyGen,
	FHEKeyGenProgress
} from './actionFHEKeyGen';


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

	//FHE prep
	FHEKeyGen,
	FHEKeyGenProgress,

	//compute functions
	secureCompute,
	secureComputeSMC,
	secureComputeFHEBuffered,
	secureComputeFHESimple,
	secureComputeProgress,
	secureComputeInvalidate
};
