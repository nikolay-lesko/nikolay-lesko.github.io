'use strict';

angular
    .module('AddressBookApp', [
        'ui.router',
        'Auth',
        'Directives',
        'Contacts'
    ])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'authentication/login/login.html',
                publicUrl: true
            })
            .state('register', {
                url: '/register',
                templateUrl: 'authentication/register/register.html',
                publicUrl: true
            })
            .state('home', {
                abstract: true,
                templateUrl: 'layout.html'
            })
            .state('home.contacts', {
                url: '/contacts',
                templateUrl: 'contacts/list/list.html'
            });

        $urlRouterProvider.otherwise('/contacts');
    }])
    .run(['$rootScope', function ($rootScope) {
        // global state store
        $rootScope.$state = {};
    }])