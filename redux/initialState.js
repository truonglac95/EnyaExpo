
const initialStore = {
	user: {
		error: null,
		loading: false,
		deleted: false,
		unreadCount: 0,
		account: [],
		loginToken: null,
		notificationCount: 0,
		internet: {},
		sharingState: {
			error: null,
			loading: false,
		},
		preportState: {
			error: null,
			loading: false,
		},
		sbConnected: false,
	},
	answer: {
		error: null,
		loading: false,
		answers: [],
		frs: [],
	},
	result: {
		error: null,
		loading: false,
		results: [],
		localResult: [],
		pleaseDownload: false,
	},
	whitelist: {
		error: null,
		loading: false,
		status: 0,
	},
};


export default initialStore;