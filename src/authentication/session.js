'use strict';

angular.module('Auth')
    .factory('Session', ['$cookieStore', function ($cookieStore) {
        return {
            get: function () {
                return $cookieStore.get('AddressBookUser');
            },
            set: function (user) {
                $cookieStore.put('AddressBookUser', user);
            },
            remove: function () {
                $cookieStore.remove('AddressBookUser');
            }
        }
    }])