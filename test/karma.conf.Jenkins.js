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
	    'karma-phantomjs-launcher-nonet',
            'karma-junit-reporter',
            'karma-jasmine'
        ],

phantomjsLauncher: {
      // configure PhantomJS executable for each platform 
      cmd: {
        win32: 'C:/phantomjs-2.0.0/bin/phantomjs.exe'
      }
    },


        // list of files / patterns to load in the browser
        files: [
            '../lib/jquery.min.js',
            '../lib/underscore.min.js',
            '../lib/angular/angular.js',
            '../lib/angular/angular-cookies.js',
            '../lib/angular/angular-ui-router.js',
            '../lib/angular/angular-mocks.js',
            '../lib/angular/ui-bootstrap-tpls-0.9.0.js',
            '../lib/angular/ui-utils.js',

            '../src/**/*.js',

            './unit/**/*.spec.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'dots', 'junit'],

	junitReporter: {
	  outputFile: 'test-results.xml'
	},


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
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
