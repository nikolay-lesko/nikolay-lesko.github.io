'use strict';

angular.module('Auth')
    .controller('LoginCtrl', ['$scope', '$state', 'Auth', function ($scope, $state, Auth) {

        $scope.User = new Auth.User();

        $scope.ErrorMessage = '';

        $scope.IsLoading = false;

        $scope.onLoginClick = function () {
            $scope.IsSubmitting = true;

            $scope.ErrorMessage = null;

            if (!$scope.form.$valid) {
                return;
            }

            $scope.IsLoading = true;

            Auth
                .login($scope.User)
                .then(function () {
                    $state.go('home.contacts');
                }, function () {
                    $scope.ErrorMessage = 'Couldn\'t authenticate with specified credentials.';
                })
                .finally(function () {
                    $scope.IsLoading = false;
                });
        }
    }])