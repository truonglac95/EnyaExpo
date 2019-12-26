
const initialStore = {
	user: {
		error: null,
		loading: false,
		deleted: false,
		account: []
	},
	answer: {
		error: null,
		loading: false,
		answers: [],
		frs: []
	},
	result: {
		error: null,
		loading: false,
		results: [],
		localResult: [],
		pleaseDownload: false
	}
};

export default initialStore;