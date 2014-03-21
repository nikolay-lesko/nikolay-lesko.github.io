var authModule = angular.module('AuthModule');

authModule.controller('RegisterCtrl', ['$scope', '$state', 'AuthService', function ($scope, $state, AuthService) {
	$scope.User = new AuthService.User();

	$scope.ErrorMessage = '';

	$scope.IsLoading = false;

	$scope.onRegisterClick = function () {
		$scope.IsSubmitting = true;

		$scope.ErrorMessage = null;

		if (!$scope.form.$valid) {
			return;
		}

		$scope.IsLoading = true;

		AuthService
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