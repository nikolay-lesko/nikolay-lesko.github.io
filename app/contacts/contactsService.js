var module = angular.module('ContactsModule');

module.factory('ContactsService', ['AuthService', 'LocalStorageService', '$q', '$timeout', '$filter', function (AuthService, LocalStorageService, $q, $timeout, $filter) {

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
					var searchExpr = new RegExp(search, 'i');

					contacts = $filter('filter')(contacts, function (c) {
						return c.Name.search(searchExpr) >= 0 || c.Surname.search(searchExpr) >= 0;
					});
				}

				var firstIndex = pageIndex * pageSize;
				var pageContacts = contacts.slice(firstIndex, firstIndex + pageSize);

				var pager = new Pager();
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

				LocalStorageService.put(getKey(), contacts);

				defer.resolve(contact);

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
		return 'contacts_' + AuthService.getUserTitle();
	}

	function getContacts() {
		return LocalStorageService.get(getKey()) || [];
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
