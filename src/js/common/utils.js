'use strict';

angular
    .module('Utils', [])
    .factory('Utils', [function () {
        return {

            Pager: function () {
                this.PageIndex = 1;
                /* first page for pagination directive is 1 */
                this.PageSize = 10;
                this.TotalResults = 0;
            },

            stringToArray: function (s) {
                if (!s)
                    return [];

                if ($.type(s) !== 'string')
                    return s;

                var arr = s.split(',');
                arr = $.map(arr, function (n) {
                    return $.trim(n);
                });
                arr = $.grep(arr, function (n) {
                    return n.length ? n : null;
                });

                return arr;
            },

            escapeRegExp: function (string) {
                return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
            }
        };
    }])