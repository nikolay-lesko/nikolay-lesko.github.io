'use strict';

angular.module('AddressBookApp')
    .controller('AppCtrl', ['$scope', 'Auth', '$state', function ($scope, Auth, $state) {
        $scope.UserTitle = Auth.getUserTitle();

        $scope.onLogoutClick = function () {
            Auth.logout();
            $state.go('login');
        }
    }])