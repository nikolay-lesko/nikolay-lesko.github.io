var app = angular.module('AddressBookApp', ['ui.router', 'AuthModule', 'DirectivesModule', 'ContactsModule']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'authentication/login.html',
			publicUrl: true
		})
		.state('register', {
			url: '/register',
			templateUrl: 'authentication/register.html',
			publicUrl: true
		})
		.state('home', {
			abstract: true,
			templateUrl: 'layout.html'
		})
		.state('home.contacts', {
			url: '/contacts',
			templateUrl: 'contacts/list.html'
		});

	$urlRouterProvider.otherwise('/contacts');
}]);

app.run(['$rootScope', function ($rootScope) {
	// global state store
	$rootScope.$state = {};
}])






























