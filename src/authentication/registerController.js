'use strict';

angular.module('Auth')
    .controller('RegisterCtrl', ['$scope', '$state', 'Auth', function ($scope, $state, Auth) {
        $scope.User = new Auth.User();

        $scope.ErrorMessage = '';

        $scope.IsLoading = false;

        $scope.onRegisterClick = function () {
            $scope.IsSubmitting = true;

            $scope.ErrorMessage = null;

            if (!$scope.form.$valid) {
                return;
            }

            $scope.IsLoading = true;

            Auth
                .register($scope.User)
                .then(function () {
                    $state.go('home.contacts');
                }, function (errMessage) {
                    $scope.ErrorMessage = 'Couldn\'t register user: ' + errMessage;
                })
                .finally(function () {
                    $scope.IsLoading = false;
                });
        }
    }])