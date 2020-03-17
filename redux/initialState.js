
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
		computing: false,
		compute_type: 'smc'
	},
	fhe: {
		error: null,
		loading: false,
		progress: []
	}
};

export default initialStore;