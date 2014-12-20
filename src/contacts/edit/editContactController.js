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
    }])