
const initialStore = {
	user: {
		error: null,
		loading: false,
		account: [],
		deleted: false
	},
	answer: {
		error: null,
		loading: false,
		answers: [],
		smc: []
	},
	result: {
		error: null,
		loading: false,
		results: []
	}
};

export default initialStore;