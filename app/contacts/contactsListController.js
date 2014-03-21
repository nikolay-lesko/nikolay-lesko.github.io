var module = angular.module('ContactsModule');

module.controller('ContactsListCtrl', ['$scope', 'ContactsService', '$modal', function ($scope, ContactsService, $modal) {
	$scope.Contacts = [];

	$scope.IsLoading = false;

	$scope.Pager = new Pager();

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
		ContactsService
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
		var modalInstance = $modal.open({
			templateUrl: 'contacts/editContactDialog.html',
			controller: 'EditContactCtrl',
			scope: $scope,
			resolve: {
				contact: function () {
					return contact;
				}
			}
		});

		modalInstance.result.then(function () {
			reload($scope.Pager.PageIndex);
		}, function (err) {
		});
	}

	$scope.onAddClick = function () {
		showEditDialog(new ContactsService.Types.Contact())
	}

	$scope.onEditClick = function (contact) {
		showEditDialog(angular.copy(contact));
	}

	reload(1);
}])
