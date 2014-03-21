var authModule = angular.module('AuthModule', ['ui.router', 'ngCookies', 'LocalStorageModule']);

authModule.factory('AuthService', ['$cookieStore', '$timeout', '$q', '$filter', 'LocalStorageService', function ($cookieStore, $timeout, $q, $filter, LocalStorageService) {

	var currentUser = $cookieStore.get('AddressBookUser') || new User();
	var isAuthenticated = currentUser.Email && currentUser.Email.length > 0;

	var userStore = {
		find: function (email) {

			var users = LocalStorageService.get('users');
			if (!users)
				return null;

			var found = $filter('filter')(users, {Email: email});
			if (!found || found.length == 0)
				return null;

			return found[0];
		},
		add: function (user) {
			if (!user)
				throw 'User wasn\'t specified';

			var users = LocalStorageService.get('users');
			if (!users)
				users = [];

			if (this.find(user.Email))
				throw 'User with the same E-Mail already exists';

			users.push(user);

			LocalStorageService.put('users', users);
		}
	}

	var auth = {
		isAuthenticated: function () {
			return isAuthenticated;
		},
		login: function (userInfo) {
			var defer = $q.defer();

			trimUserFields(userInfo);

			// simulate request to remote server
			$timeout(function () {
				if (!userInfo)
					return defer.reject('You should specify user credentials');

				var user = userStore.find(userInfo.Email);
				if (user && (user.Password == userInfo.Password)) {
					setCurrentUser(user);

					defer.resolve(user);
				}
				else
					defer.reject('No user found with credentials - ' + userInfo.Email + ':' + userInfo.Password);

			}, 200);

			return defer.promise;
		},
		logout: function () {
			$cookieStore.remove('AddressBookUser');

			currentUser = new User();
			isAuthenticated = false;
		},
		register: function (user) {
			var defer = $q.defer();

			// simulate request to remote server
			$timeout(function () {
				if (!user)
					return defer.reject('You should specify new user info');

				trimUserFields(user);

				if (!user.Email || !user.Email.length)
					return defer.reject('You should specify E-Mail for new user');

				if (!user.Password || !user.Password.length)
					return defer.reject('You should specify password for new user');

				var existingUser = userStore.find(user.Email);
				if (existingUser)
					defer.reject('User with specified E-Mail already exists');
				else {
					userStore.add(user);
					setCurrentUser(user);

					defer.resolve(user);
				}
			}, 200);

			return defer.promise;
		},
		getUserTitle: function () {
			return isAuthenticated ? currentUser.Email : '';
		},

		User: User
	};

	function User() {
		this.Email = null;
		this.Password = null;
	}

	function setCurrentUser(user) {
		$cookieStore.put('AddressBookUser', user);
		currentUser = user;
		isAuthenticated = true;
	}

	function trimUserFields(user) {
		if (!user)
			return;

		user.Email = user.Email ? $.trim(user.Email) : null;
		user.Password = user.Password ? $.trim(user.Password) : null;
	}

	return auth;
}])

authModule.run(['$rootScope', '$state', 'AuthService', function ($rootScope, $state, AuthService) {
	$rootScope.$on("$stateChangeStart",
		function (event, toState, toParams, fromState, fromParams) {
			if (!toState.publicUrl) {
				if (!AuthService.isAuthenticated()) {
					$rootScope.error = 'Access denied';
					event.preventDefault();

					$state.go('login');
				}
			}
		}
	);
}])