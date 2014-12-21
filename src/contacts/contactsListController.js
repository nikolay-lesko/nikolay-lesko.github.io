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
                    templateUrl: 'contacts/editContactDialog.html',
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
