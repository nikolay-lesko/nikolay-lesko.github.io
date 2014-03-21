var app = angular.module('AddressBookApp');

app.controller('AppCtrl', ['$scope', 'AuthService', '$state', function ($scope, AuthService, $state) {
	$scope.UserTitle = AuthService.getUserTitle();

	$scope.onLogoutClick = function () {
		AuthService.logout();
		$state.go('login');
	}
}])