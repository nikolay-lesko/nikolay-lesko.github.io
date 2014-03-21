var authModule = angular.module('AuthModule');

authModule.controller('LoginCtrl', ['$scope', '$state', 'AuthService', function ($scope, $state, AuthService) {

	$scope.User = new AuthService.User();

	$scope.ErrorMessage = '';

	$scope.IsLoading = false;

	$scope.onLoginClick = function () {
		$scope.IsSubmitting = true;

		$scope.ErrorMessage = null;

		if (!$scope.form.$valid) {
			return;
		}

		$scope.IsLoading = true;

		AuthService
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