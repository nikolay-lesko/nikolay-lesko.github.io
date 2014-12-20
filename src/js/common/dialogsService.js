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
    }])