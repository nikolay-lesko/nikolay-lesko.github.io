// Karma configuration
// Generated on Wed Mar 19 2014 10:13:00 GMT+0200 (Финляндия (зима))

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],

		plugins: [
			'karma-junit-reporter',
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-jasmine'
		],


		// list of files / patterns to load in the browser
		files: [
			'../app/lib/jquery-ui-1.10.3.custom/js/jquery-1.9.1.js',
			'../app/lib/angular/angular.js',
			'../app/lib/angular/angular-cookies.js',
			'../app/lib/angular/angular-ui-router.js',
			'../app/lib/angular/angular-mocks.js',
			'../app/lib/bootstrap-gh-pages/ui-bootstrap-tpls-0.9.0.js',
			'../app/lib/ui-utils-0.1.1/ui-utils.js',

			'../app/js/*.js',
			'../app/authentication/*.js',
			'../app/contacts/contacts_module.js',
			'../app/contacts/contactsService.js',
			'../app/contacts/contactsListController.js',
			'../app/contacts/editContactController.js',

			'./unit/**/*.spec.js'
		],


		// list of files to exclude
		exclude: [

		],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {

		},


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['Chrome'],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true
	});
};
