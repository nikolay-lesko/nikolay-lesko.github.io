'use strict';

angular
    .module('Underscore', [])
    .factory('_', function () {
        return window._;
    });