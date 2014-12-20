describe('Contacts List Controller', function () {

	var scope;
	var timeout;
	var contacts;
	var modal;
	var controllerService;
	var localStorage;

	function createController() {
		return controllerService('ContactsListCtrl', {
			'$scope': scope,
			'Contacts': contacts,
			'$modal': modal
		});
	}

	var storedContacts = [
		{Name: 'Andrey', Surname: 'Bunin', Phone: '234', Group: 'Friend'},
		{Name: 'Ivan', Surname: 'Petrov', Phone: '123', Group: ''}
	];

	beforeEach(function () {
		angular.mock.module('Contacts');

		inject(function ($controller, $rootScope, Contacts, $modal, LocalStorage, $timeout) {
			controllerService = $controller;
			scope = $rootScope.$new();
			contacts = Contacts;
			timeout = $timeout;
			modal = $modal;
			localStorage = LocalStorage;

			spyOn(localStorage, 'get').andReturn(storedContacts);
			spyOn(localStorage, 'put').andCallFake(function (key, value) {
				storedContacts = value;
			})
		})
	})

	it('should contain stored data', function () {
		var controller = createController();
		timeout.flush();

		// by default sorting is by Name so initially storedContacts are ordered by name
		expect(scope.Contacts).toEqual([
			{Group: undefined, Contacts: storedContacts}
		]);
	})

	it('should show and hide loading progress', function () {
		var showed;

		localStorage.get.andCallFake(function () {
			showed = scope.IsLoading;

			return storedContacts;
		});

		var controller = createController();
		timeout.flush();

		expect(showed).toEqual(true);
	})

	it('should go to page', function () {
		var controller = createController();
		timeout.flush();

		scope.Pager.PageIndex = 1;
		scope.Pager.PageSize = 1;

		var spy = spyOn(contacts, 'list').andCallThrough();
		scope.onSelectPage(2);
		timeout.flush();
		expect(spy).toHaveBeenCalled();

		// it shouldn't go to the same page if user clicks it
		spy.reset();
		scope.onSelectPage(2);
		expect(spy).not.toHaveBeenCalled();
	})

	it('should sort on Sort change', function () {
		var controller = createController();

		var spy = spyOn(contacts, 'list').andCallThrough();

		scope.Sort.Field = scope.Sort.Field + '_changed';
		scope.$digest();
		expect(spy).toHaveBeenCalled();

		spy.reset();
		scope.Sort.Desc = !scope.Sort.Desc;
		scope.$digest();
		expect(spy).toHaveBeenCalled();
	})

	it('should group on Grouping change', function () {
		var controller = createController();

		var spy = spyOn(contacts, 'list').andCallThrough();

		var grouping = {
			Name: 'Some group name',
			By: 'Some group field'
		};

		scope.Grouping = grouping;
		scope.$digest();
		expect(spy).toHaveBeenCalled();

		spy.reset();
		scope.Grouping = grouping;
		scope.$digest();
		expect(spy).not.toHaveBeenCalled();
	})

	it('should search', function () {
		var controller = createController();

		var spy = spyOn(contacts, 'list').andCallThrough();

		scope.onSearchClick();
		expect(spy).not.toHaveBeenCalled();

		spy.reset();
		scope.SearchText = 'some';
		scope.onSearchClick();
		expect(spy).toHaveBeenCalled();

		// it shouldn't search again with the same query
		spy.reset();
		scope.SearchText = ' some  ';
		scope.onSearchClick();
		expect(spy).not.toHaveBeenCalled();
	})

	it('should open create dialog with new contact', inject(function ($q) {
		var controller = createController();

		var contact;
		spyOn(modal, 'open').andCallFake(function (options) {
			contact = options.resolve.contact();

			return {
				result: $q.defer().promise
			};
		});

		scope.onAddClick();
		expect(contact.Id).toEqual(0);

		var existing = {Id: 1, Name: 'Ivan'};
		scope.onEditClick(existing);
		//dialog should use cloned version, so in case of cancel it doesn't affect list UI
		expect(contact).not.toBe(existing);
		expect(contact.Id).toEqual(existing.Id);
	}))
})

























