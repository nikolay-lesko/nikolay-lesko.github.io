/*

address-book 1.0.0

*/


'use strict';

angular.module('Auth', [
    'ui.router',
    'ngCookies',
    'User'
]);;

/* ------------------------------------------------------------------------ */

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
    }]);

/* ------------------------------------------------------------------------ */

'use strict';

angular.module('Auth')
    .controller('LoginCtrl', ['$scope', '$state', 'Auth', function ($scope, $state, Auth) {

        $scope.User = new Auth.User();

        $scope.ErrorMessage = '';

        $scope.IsLoading = false;

        $scope.onLoginClick = function () {
            $scope.IsSubmitting = true;

            $scope.ErrorMessage = null;

            if (!$scope.form.$valid) {
                return;
            }

            $scope.IsLoading = true;

            Auth
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
    }]);

/* ------------------------------------------------------------------------ */

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
    }]);

/* ------------------------------------------------------------------------ */

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
    }]);

/* ------------------------------------------------------------------------ */

'use strict';

angular.module('Contacts', [
    'ui.bootstrap',
    'ui.utils',
    'Underscore',
    'Auth',
    'Dialogs',
    'Utils']);
;

/* ------------------------------------------------------------------------ */

'use strict';

angular.module('Contacts')
    .factory('Contacts', ['Auth', 'LocalStorage', 'Utils', '$q', '$timeout', '$filter', '_', function (Auth, LocalStorage, Utils, $q, $timeout, $filter, _) {

        var lastId = 0;

        calculateLastId();

        return {

            list: function (pageIndex, pageSize, sort, search) {
                var defer = $q.defer();

                $timeout(function () {

                    if (pageIndex == undefined || pageSize == undefined || pageIndex < 0 || pageSize <= 0)
                        return defer.reject('Invalid pager parameters');

                    var contacts = getContacts();

                    if (sort) {
                        var sortExpr = (sort.Desc ? '-' : '+') + sort.Field;
                        contacts = $filter('orderBy')(contacts, sortExpr);
                    }

                    if (search && search.length > 0) {
                        var searchExpr = new RegExp(Utils.escapeRegExp(search), 'i');

                        var phoneSearch = search.replace(/\D/g, '');
                        var phoneSearchExpr = phoneSearch.length ? new RegExp(Utils.escapeRegExp(phoneSearch), 'i') : null;

                        contacts = $filter('filter')(contacts, function (c) {
                            return c.Name.search(searchExpr) >= 0 ||
                                c.Surname.search(searchExpr) >= 0 ||
                                (phoneSearchExpr && c.Phone.search(phoneSearchExpr) >= 0);
                        });
                    }

                    var firstIndex = pageIndex * pageSize;
                    var pageContacts = contacts.slice(firstIndex, firstIndex + pageSize);

                    var pager = new Utils.Pager();
                    pager.PageSize = pageSize;
                    pager.PageIndex = Math.min(pageIndex, contacts.length / pageSize);
                    pager.TotalResults = contacts.length;

                    defer.resolve({
                        Contacts: pageContacts,
                        Pager: pager
                    });

                }, 300);

                return defer.promise;
            },

            save: function (contact) {
                var defer = $q.defer();

                $timeout(function () {
                    if (!contact.Name || !$.trim(contact.Name).length)
                        return defer.reject('Name is mandatory field');

                    if (!contact.Phone || !$.trim(contact.Phone).length)
                        return defer.reject('Phone is mandatory field')

                    contact.Name = $.trim(contact.Name);
                    contact.Surname = $.trim(contact.Surname);
                    contact.Phone = $.trim(contact.Phone);
                    contact.Group = $.trim(contact.Group);

                    var contacts = getContacts();

                    var samePhoneContacts = $filter('filter')(contacts, {Phone: contact.Phone});
                    if (samePhoneContacts && samePhoneContacts.length) {
                        if (samePhoneContacts[0].Id != contact.Id)
                            return defer.reject('Already exists contact with the same phone');
                    }

                    if (contact.Id == undefined || contact.Id <= 0) {


                        contact.Id = lastId++;
                        contacts.push(contact);
                    }
                    else {
                        var stored = $filter('filter')(contacts, {Id: contact.Id});
                        if (!stored)
                            return defer.reject('Couldn\'t find contact with Id = ' + contact.Id);

                        var storedContact = stored[0];
                        // update contact in storage
                        angular.copy(contact, storedContact);
                    }

                    saveContacts(contacts);

                    defer.resolve(contact);

                }, 300);

                return defer.promise;
            },

            delete: function (contact) {
                var defer = $q.defer();

                $timeout(function () {
                    var contacts = getContacts();


                    var index = _.indexOf(contacts, _.find(contacts, function (c) {
                        return c.Id == contact.Id;
                    }));

                    if (index >= 0) {
                        contacts.splice(index, 1);

                        saveContacts(contacts);

                        return defer.resolve(index);
                    }
                    else
                        return defer.reject('Couldn\'t find contact with Id = ' + contact.Id);

                }, 300);

                return defer.promise;
            },

            groups: function () {
                var defer = $q.defer();

                $timeout(function () {
                    var contacts = getContacts();

                    var groups = [];
                    angular.forEach(contacts, function (c) {
                        var groupToAdd = c.Group;
                        if (groupToAdd) {
                            var lower = groupToAdd.toLowerCase();

                            var selectPredicate = function (g) {
                                return g.toLowerCase() == lower ? g : null;
                            };

                            if ($.grep(groups, selectPredicate).length == 0)
                                groups.push(groupToAdd);
                        }
                    });

                    groups = $filter('orderBy')(groups, function (g) {
                        return g;
                    });

                    defer.resolve(groups);
                }, 100);

                return defer.promise;
            },

            Types: {
                Contact: Contact
            }
        };

        function getKey() {
            return 'contacts_' + Auth.getUserTitle();
        }

        function getContacts() {
            return LocalStorage.get(getKey()) || [];
        }

        function saveContacts(contacts) {
            LocalStorage.put(getKey(), contacts);
        }

        function Contact() {
            this.Id = 0;
            this.Name = '';
            this.Surname = '';
            this.Phone = '';
            this.Group = '';
        }

        function calculateLastId() {
            var contacts = getContacts();

            angular.forEach(contacts, function (c) {
                lastId = Math.max(lastId, c.Id);
            });

            lastId++;
        }
    }])
;

/* ------------------------------------------------------------------------ */

'use strict';

angular
    .module('Contacts')
    .controller('EditContactCtrl', ['$scope', '$modalInstance', 'Contacts', 'contact', function ($scope, $modalInstance, Contacts, contact) {

        $scope.Contact = contact || new Contacts.Types.Contact();

        $scope.Title = contact.Id <= 0 ? 'Add contact' : 'Edit contact';

        $scope.Groups = [];

        $scope.onSelectGroup = function (g) {
            $scope.Contact.Group = g;

            return false;
        }

        $scope.onCancelClick = function () {
            $modalInstance.dismiss('cancel');
        }

        // ui-bootstrap modal bug with scope. we need to wrap simple types in object
        $scope.ScopeFix = {
            Error: null,
            IsLoading: false
        };

        $scope.onSaveClick = function (form) {
            $scope.IsSubmitting = true;

            if (form.$invalid)
                return;

            $scope.ScopeFix.IsLoading = true;
            $scope.ScopeFix.Error = null;

            Contacts
                .save($scope.Contact)
                .then(function (saved) {
                    $modalInstance.close(saved);
                }, function (err) {
                    $scope.ScopeFix.Error = err;
                })
                .finally(function () {
                    $scope.ScopeFix.IsLoading = false;
                });
        }

        function loadGroups() {
            Contacts
                .groups()
                .then(function (groups) {
                    $scope.Groups = groups;
                })
        }

        loadGroups();
    }]);

/* ------------------------------------------------------------------------ */

'use strict';

angular.module('Contacts')
    .controller('ContactsListCtrl', ['$scope', 'Contacts', 'Dialogs', 'Utils', function ($scope, Contacts, Dialogs, Utils) {
        $scope.Contacts = [];

        $scope.IsLoading = false;

        $scope.Pager = new Utils.Pager();

        $scope.AvailableGroupings = [
            {
                Name: 'None',
                Sort: 'Name'
            },
            {
                Name: 'Group',
                By: 'Group',
                Sort: 'Group'
            }
        ];

        $scope.Grouping = $scope.AvailableGroupings[0];
        $scope.$watch('Grouping', function () {
            $scope.Sort.Field = $scope.Grouping.Sort;
            $scope.Sort.Desc = false;

            reload(1);
        })

        $scope.Sort = {
            Field: 'Name',
            Desc: false
        }
        $scope.$watch('Sort.Field+Sort.Desc', function () {
            reload($scope.Pager.PageIndex);
        })

        $scope.SearchText = '';
        var prevSearchText = '';
        $scope.onSearchClick = function () {
            $scope.SearchText = $.trim($scope.SearchText);

            if ($scope.SearchText == prevSearchText)
                return;

            prevSearchText = $scope.SearchText;
            reload(1);
        }

        $scope.onSelectPage = function (pageIndex) {
            if (pageIndex == $scope.Pager.PageIndex)
                return;

            reload(pageIndex)
        }

        function reload(pageIndex) {
            $scope.IsLoading = true;

            // first page for service is 0, for ui-bootstrap it is 1
            Contacts
                .list(pageIndex - 1, $scope.Pager.PageSize, $scope.Sort, $scope.SearchText)
                .then(function (res) {

                    var grouped;
                    if ($scope.Grouping.By) {
                        grouped = _.groupBy(res.Contacts, $scope.Grouping.By);
                        grouped = _.map(grouped, function (contacts, group) {
                            return {Group: group, Contacts: contacts};
                        });
                    }
                    else {
                        grouped = [
                            {Group: undefined, Contacts: res.Contacts}
                        ];
                    }

                    $scope.Contacts = grouped;
                    $scope.Pager = res.Pager;
                    $scope.Pager.PageIndex++;

                }, function (err) {

                })
                .finally(function () {
                    $scope.IsLoading = false;
                });
        }

        function showEditDialog(contact) {

            Dialogs
                .open({
                    templateUrl: 'contacts/edit/editContactDialog.html',
                    controller: 'EditContactCtrl',
                    keyboard: false,
                    backdrop: 'static',
                    scope: $scope,
                    resolve: {
                        contact: function () {
                            return contact;
                        }
                    }
                })
                .then(function () {
                    reload($scope.Pager.PageIndex);
                });
        }

        $scope.onAddClick = function () {
            showEditDialog(new Contacts.Types.Contact())
        }

        $scope.onEditClick = function (contact) {
            showEditDialog(angular.copy(contact));
        }

        $scope.onDeleteClick = function (contact, confirmMessage) {
            Dialogs
                .confirm({message: confirmMessage})
                .then(function () {
                    var i = 0;
                    Contacts
                        .delete(contact)
                        .then(function (res) {
                            reload($scope.Pager.PageIndex);
                        });
                });
        }

        reload(1);
    }])
;

/* ------------------------------------------------------------------------ */

'use strict';

angular
    .module('AddressBookApp', [
        'ui.router',
        'Auth',
        'Directives',
        'Contacts'
    ])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'authentication/login/login.html',
                publicUrl: true
            })
            .state('register', {
                url: '/register',
                templateUrl: 'authentication/register/register.html',
                publicUrl: true
            })
            .state('home', {
                abstract: true,
                templateUrl: 'layout.html'
            })
            .state('home.contacts', {
                url: '/contacts',
                templateUrl: 'contacts/list/list.html'
            });

        $urlRouterProvider.otherwise('/contacts');
    }])
    .run(['$rootScope', function ($rootScope) {
        // global state store
        $rootScope.$state = {};
    }]);

/* ------------------------------------------------------------------------ */

'use strict';

angular.module('AddressBookApp')
    .controller('AppCtrl', ['$scope', 'Auth', '$state', function ($scope, Auth, $state) {
        $scope.UserTitle = Auth.getUserTitle();

        $scope.onLogoutClick = function () {
            Auth.logout();
            $state.go('login');
        }
    }]);

/* ------------------------------------------------------------------------ */

'use strict';

angular
    .module('Dialogs', [])
    .factory('Dialogs', ['$modal', function ($modal) {
        return {
            confirm: function (confirmOptions) {
                return $modal.open({
                    templateUrl: 'confirmDialog.html',
                    controller: ['$scope', '$modalInstance', 'ConfirmOptions', function ($scope, $modalInstance, ConfirmOptions) {
                        $scope.Title = ConfirmOptions.Title;
                        $scope.Message = ConfirmOptions.Message;

                        $scope.onYesClick = function () {
                            $modalInstance.close(true);
                        };
                        $scope.onNoClick = function () {
                            $modalInstance.dismiss('cancel')
                        };
                    }],
                    resolve: {
                        ConfirmOptions: function () {
                            return {
                                Title: confirmOptions.title || 'Confirm dialog',
                                Message: confirmOptions.message
                            };
                        }
                    }
                }).result;
            },
            open: function (dialogOptions) {
                return $modal.open(dialogOptions).result;
            }
        }
    }]);

/* ------------------------------------------------------------------------ */

'use strict';

angular
    .module('Directives', ['Utils'])

    .factory('DirectivesUtils', ['Utils', function (Utils) {
        return {

            createPropertiesWatch: function (scope, names, watchProperties, callback) {
                names = Utils.stringToArray(names);
                watchProperties = Utils.stringToArray(watchProperties);

                angular.forEach(names, function (name) {
                    var watchPath = 'form.' + name;
                    var expr = '';

                    angular.forEach(watchProperties, function (prop) {
                        if (expr != '')
                            expr += '+';

                        expr += watchPath + '.' + prop;
                    })

                    scope.$watch(expr, function (n) {
                        return function () {
                            var el = scope.form[n];

                            callback(el);
                        }
                    }(name));
                });
            },

            createValidationPropertiesWatch: function (scope, names, callback) {

                function watchCallback(watchScope) {
                    var invalid = watchScope.$invalid && (watchScope.$dirty || scope.IsSubmitting);

                    callback(watchScope, invalid);
                }

                this.createPropertiesWatch(scope, names, ['$valid', '$dirty'], watchCallback);

                var namesArr = Utils.stringToArray(names);
                scope.$watch('IsSubmitting', function () {
                    angular.forEach(namesArr, function (n) {
                        var el = scope.form[n];

                        watchCallback(el);
                    })
                });
            }
        }
    }])

    .directive('validationHighlight', ['DirectivesUtils', function (DirectivesUtils) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var name = attrs.name;
                if (!name)
                    throw  'validation-highlight: Element should have property "name"';

                var parentSelector = $.trim(attrs.validationHighlight);
                var parent = parentSelector == 'parent' ? element.parent() : element.closest(parentSelector || '.form-group');
                if (!parent.length)
                    parent = element.parent();

                DirectivesUtils.createValidationPropertiesWatch(scope, name, function (watchScope, invalid) {
                    if (invalid)
                        parent.addClass('has-error');
                    else
                        parent.removeClass('has-error');
                });
            }
        }
    }])

    .directive('progressIndicator', [function () {
        return {
            restrict: 'E',
            template: '<div class="loading">' +
            '           <div class="background"></div>' +
            '           <div class="content">' +
            '               <img src="css/img/loading.gif"/>' +
            '           </div>' +
            '</div>'
        }
    }])

    .directive('sortField', [function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                for: '@',
                current: '=',
                desc: '='
            },
            template: '' +
            '<span class="sort-field" ng-click="onToggleClick()" ng-class="{ active: current == for }" style="cursor:pointer">' +
            '   <span ng-transclude ></span> ' +
            '   <button class="btn btn-default glyphicon "' +
            '           ng-class="getButtonClass()" ' +
            '           ng-style="getButtonStyle()"></button>' +
            '</span>',
            link: function (scope, element, attrs) {
                if (!scope.desc)
                    scope.desc = false;

                scope.onToggleClick = function () {
                    if (scope.current != scope.for) {
                        scope.current = scope.for;
                        scope.desc = false;
                    }
                    else
                        scope.desc = !scope.desc;
                };

                scope.getButtonStyle = function () {
                    var style = {
                        visibility: scope.current == scope.for ? 'visible' : 'collapse'
                    };

                    return style;
                };

                scope.getButtonClass = function () {
                    return scope.desc
                        ? 'glyphicon-sort-by-attributes-alt'
                        : 'glyphicon-sort-by-attributes';
                };

                scope.getContentStyle = function () {
                    var style = {
                        cursor: scope.for != scope.current ? 'pointer' : ''
                    }
                    return style;
                };
            }
        }
    }]);

/* ------------------------------------------------------------------------ */

'use strict';

angular
    .module('LocalStorage', [])
    .factory('LocalStorage', [function () {

        function checkStorageExists() {
            if (typeof (Storage) === 'undefined')
                throw  'Local storage is not available';
        }

        function getFullKey(key) {
            return 'address_book_' + key;
        }

        function checkKey(key) {
            if ($.type(key) !== 'string')
                throw  'Key is not valid';

            key = $.trim(key);

            if (!key)
                throw  'Key is not valid';

            return key;
        }

        return {
            put: function (key, value) {
                key = checkKey(key);

                checkStorageExists();

                var json = JSON.stringify(value);
                window.localStorage.setItem(getFullKey(key), json);
            },
            get: function (key) {
                key = checkKey(key);

                checkStorageExists();

                var json = window.localStorage.getItem(getFullKey(key));
                if (!json)
                    return null;

                var res = JSON.parse(json);
                return res;
            },
            remove: function (key) {
                key = checkKey(key);

                checkStorageExists();

                window.localStorage.removeItem(getFullKey(key));
            }
        }
    }]);

/* ------------------------------------------------------------------------ */

'use strict';

angular
    .module('Underscore', [])
    .factory('_', function () {
        return window._;
    });;

/* ------------------------------------------------------------------------ */

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
    }]);;

/* ------------------------------------------------------------------------ */

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