'use strict';

angular
    .module('User', [
        'LocalStorage',
        'Auth',
        'Underscore'
    ])
    .factory('User', ['LocalStorage', '_', function (LocalStorage, _) {

        function User() {
            this.Email = null;
            this.Password = null;
        }

        User.find = function (email) {

            var users = LocalStorage.get('users');
            if (!users)
                return null;

            var found = _.findWhere(users, {Email: email});

            return found || null;
        };

        User.add = function (user) {
            if (!user)
                throw 'User wasn\'t specified';

            var users = LocalStorage.get('users');
            if (!users)
                users = [];

            if (this.find(user.Email))
                throw 'User with the same E-Mail already exists';

            users.push(user);

            LocalStorage.put('users', users);
        };

        return User;
    }]);