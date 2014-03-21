describe('Contacts', function () {
	browser.get('#/login');

	beforeEach(function () {
		browser.manage().addCookie('AddressBookUser', '{"Email": "tester@domain.com"}');

		var usersJson = '[' +
			'   { "Id":1, "Name":"Ivan","Surname":"Petrov","Phone":"0501111111","Group":""},' +
			'   { "Id":2, "Name":"Andrey","Surname":"Bunin","Phone":"0502222222","Group":"Friend"}' +
			']';

		var setScript = "window.localStorage.setItem('address_book_contacts_tester@domain.com','" + usersJson + "')";
		browser.executeScript(setScript);

		browser.get('#/contacts');
	})

	afterEach(function () {
		browser.manage().deleteAllCookies();

		browser.executeScript('window.localStorage.removeItem("address_book_contacts_tester@domain.com")')
	})


	it('should show contacts', function () {

		var allGroups = element.all(by.repeater('g in Contacts'));
		allGroups.then(function (groups) {
			// by default there is no grouping and so there is no group header at all
			expect(groups.length).toEqual(0);
		})

		// check default sorting by Name
		var allContacts = element.all(by.repeater('c in g.Contacts').column('c.Name'));
		allContacts.then(function (contacts) {
			expect(contacts.length).toEqual(2);

			// check sort by Name
			expect(contacts[0].getText()).toEqual('Andrey');
			expect(contacts[1].getText()).toEqual('Ivan');
		})
	})

	it('should sort desc by Name', function () {
		// now it sorts by Name, we change its direction

		element(by.id('sortByName')).findElement(by.css('.sort-field')).click();
		var allContacts = element.all(by.repeater('c in g.Contacts').column('c.Name'));
		allContacts.then(function (contacts) {
			expect(contacts.length).toEqual(2);

			// check desc sort by Name
			expect(contacts[0].getText()).toEqual('Ivan');
			expect(contacts[1].getText()).toEqual('Andrey');
		})
	})

	it('should sort by Surname', function () {
		var sortField = element(by.id('sortBySurname')).findElement(by.css('.sort-field'));

		sortField.click();
		var allContacts = element.all(by.repeater('c in g.Contacts').column('c.Surname'));
		allContacts.then(function (contacts) {
			expect(contacts.length).toEqual(2);

			expect(contacts[0].getText()).toEqual('Bunin');
			expect(contacts[1].getText()).toEqual('Petrov');

			sortField.click();
			allContacts = element.all(by.repeater('c in g.Contacts').column('c.Surname'));
			allContacts.then(function (contacts) {
				expect(contacts.length).toEqual(2);

				// check desc sort by Surname
				expect(contacts[0].getText()).toEqual('Petrov');
				expect(contacts[1].getText()).toEqual('Bunin');
			})
		})
	})

	it('should sort by Phone', function () {
		var sortField = element(by.id('sortByPhone')).findElement(by.css('.sort-field'));

		sortField.click();
		var allContacts = element.all(by.repeater('c in g.Contacts').column('c.Phone'));
		allContacts.then(function (contacts) {
			expect(contacts.length).toEqual(2);

			expect(contacts[0].getText()).toEqual('(050) 111-1111');
			expect(contacts[1].getText()).toEqual('(050) 222-2222');

			sortField.click();
			allContacts = element.all(by.repeater('c in g.Contacts').column('c.Phone'));
			allContacts.then(function (contacts) {
				expect(contacts.length).toEqual(2);

				// check desc sort by Surname
				expect(contacts[0].getText()).toEqual('(050) 222-2222');
				expect(contacts[1].getText()).toEqual('(050) 111-1111');
			})
		})
	})

	it('should sort by Group', function () {
		var sortField = element(by.id('sortByGroup')).findElement(by.css('.sort-field'));

		sortField.click();
		var allContacts = element.all(by.repeater('c in g.Contacts').column('c.Group'));
		allContacts.then(function (contacts) {
			expect(contacts.length).toEqual(2);

			expect(contacts[0].getText()).toEqual('');
			expect(contacts[1].getText()).toEqual('Friend');

			sortField.click();
			allContacts = element.all(by.repeater('c in g.Contacts').column('c.Group'));
			allContacts.then(function (contacts) {
				expect(contacts.length).toEqual(2);

				// check desc sort by Surname
				expect(contacts[0].getText()).toEqual('Friend');
				expect(contacts[1].getText()).toEqual('');
			})
		})
	})

	it('should search', function () {
		element(by.model('SearchText')).sendKeys('Ivan');
		element(by.css('[ng-click="onSearchClick()"]')).click();

		var allContacts = element.all(by.repeater('c in g.Contacts').column('c.Name'));
		allContacts.then(function (contacts) {
			expect(contacts.length).toEqual(1);

			// check desc sort by Name
			expect(contacts[0].getText()).toEqual('Ivan');
		})
	})

	it('should group', function () {

		element.all(by.css('#groupSelect option')).then(function (selects) {
			expect(selects.length).toEqual(2);

			var groupSelect = selects[1];
			groupSelect.click();


			element.all(by.css('.group-header')).then(function (groupHeaders) {
				expect(groupHeaders.length).toEqual(2);
			})

			element.all(by.css('#sortByGroup .active')).then(function (activeFields) {
				expect(activeFields.length).toEqual(1);
			});
		})
	})
})















