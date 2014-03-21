exports.config = {
	specs: [
		'./e2e/**/*.spec.js'
	],

	seleniumAddress: 'http://localhost:4444/wd/hub',

	baseUrl: 'http://localhost:63342/AddressBook/app/'
};