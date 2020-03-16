
const initialStore = {
	user: {
		error: null,
		loading: false,
		deleted: false,
		account: [],
	},
	answer: {
		error: null,
		loading: false,
		answers: [] //the user's answers
	},
	compute: {
		error: null,
		result: 0.0,
		resultCurrent: false,
		haveSC: false,
		progress: 0,
		computing: false,
	},
	fhe: {
		error: null,
		loading: false,
		progress: []
	}
};

export default initialStore;