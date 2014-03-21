describe('Edit Dialog', function () {
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

	function clickSave() {
		element(by.css('[ng-click="onSaveClick(form)"]')).click();
	}

	describe('Create New', function () {
		function openCreate() {
			element(by.css('[ng-click="onAddClick()"]')).click();
		}

		it('should open', function () {

			expect(element(by.className('modal-body')).isPresent()).toBe(false);

			openCreate();

			expect(element(by.className('modal-body')).isPresent()).toBe(true);
		})

		it('can be cancelled', function () {
			openCreate();

			element(by.css('[ng-click="onCancelClick()"]')).click();

			expect(element(by.className('modal-body')).isPresent()).toBe(false);
		})

		it('should validate', function () {
			openCreate();

			clickSave();
			expect(element(by.className('modal-body')).isPresent()).toBe(true);

			element(by.model('Contact.Name')).getAttribute('class').then(function (classes) {
				var isInvalid = classes.indexOf('ng-invalid') >= 0;
				expect(isInvalid).toEqual(true);
			})

			element(by.model('Contact.Phone')).getAttribute('class').then(function (classes) {
				var isInvalid = classes.indexOf('ng-invalid') >= 0;
				expect(isInvalid).toEqual(true);
			})
		})

		it('should save valid', function () {
			openCreate();

			element(by.model('Contact.Name')).sendKeys('Alexandr');
			element(by.model('Contact.Surname')).sendKeys('Ivanov');
			element(by.model('Contact.Phone')).sendKeys('0501234567');
			element(by.model('Contact.Group')).sendKeys('Work');
			clickSave();

			expect(element(by.className('modal-body')).isPresent()).toBe(false);

			var allContacts = element.all(by.repeater('c in g.Contacts').column('Name'));
			allContacts.then(function (contacts) {
				expect(contacts.length).toEqual(3);

				// default sort by Name
				expect(contacts[0].getText()).toEqual('Alexandr');
				expect(contacts[1].getText()).toEqual('Andrey');
				expect(contacts[2].getText()).toEqual('Ivan');
			})
		})
	})

	describe('Edit Existing', function () {

		function openEditFirst() {
			element(by.css('[ng-click="onEditClick(c)"]:first-child')).click();
		}

		it('should open', function () {
			expect(element(by.className('modal-body')).isPresent()).toBe(false);

			openEditFirst();

			expect(element(by.className('modal-body')).isPresent()).toBe(true);
		})

		it('should have user data', function () {
			openEditFirst();

			expect(element(by.model('Contact.Name')).getAttribute('value')).toEqual('Andrey');
			expect(element(by.model('Contact.Surname')).getAttribute('value')).toEqual('Bunin');
			expect(element(by.model('Contact.Phone')).getAttribute('value')).toEqual('(050) 222-2222');
			expect(element(by.model('Contact.Group')).getAttribute('value')).toEqual('Friend');
		})

		it('should validate', function () {
			openEditFirst();

			var nameEditor = element(by.model('Contact.Name'));
			nameEditor.clear();
			var phoneEditor = element(by.model('Contact.Phone'));
			phoneEditor.clear();

			clickSave();

			nameEditor.getAttribute('class').then(function (classes) {
				var isInvalid = classes.indexOf('ng-invalid') >= 0;
				expect(isInvalid).toEqual(true);
			})

			phoneEditor.getAttribute('class').then(function (classes) {
				var isInvalid = classes.indexOf('ng-invalid') >= 0;
				expect(isInvalid).toEqual(true);
			})
		})

		it('should save', function () {
			openEditFirst();

			var nameEditor = element(by.model('Contact.Name'));
			nameEditor.clear();
			nameEditor.sendKeys('Andreyka');

			clickSave();
			expect(element(by.className('modal-body')).isPresent()).toBe(false);

			var allContacts = element.all(by.repeater('c in g.Contacts').column('Name'));
			allContacts.then(function (contacts) {
				expect(contacts.length).toEqual(2);

				// default sort by Name
				expect(contacts[0].getText()).toEqual('Andreyka');
			})
		})
	})

})

































