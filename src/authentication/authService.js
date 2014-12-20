'use strict';

angular.module('Auth')
    .factory('Auth', ['$timeout', '$q', 'User', 'Session', function ($timeout, $q, User, Session) {

        var currentUser = Session.get() || new User();
        var isAuthenticated = currentUser.Email && currentUser.Email.length > 0;

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

                    var user = User.find(userInfo.Email);
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
                Session.remove();

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

                    var existingUser = User.find(user.Email);
                    if (existingUser)
                        defer.reject('User with specified E-Mail already exists');
                    else {
                        User.add(user);
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

        function setCurrentUser(user) {
            Session.set(user);

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

    .run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {
        $rootScope.$on("$stateChangeStart",
            function (event, toState, toParams, fromState, fromParams) {
                if (!toState.publicUrl) {
                    if (!Auth.isAuthenticated()) {
                        $rootScope.error = 'Access denied';
                        event.preventDefault();

                        $state.go('login');
                    }
                }
            }
        );
    }])