describe('Contacts Service', function () {
	var timeout;

	beforeEach(function () {
		angular.mock.module('ContactsModule');

		inject(function ($timeout) {
			timeout = $timeout;
		})
	})

	function waitPromiseResult(promise, success, error) {
		runs(function () {
			promise.then(success, error);

			timeout.flush();

			return promise;
		});
	}

	it('should contain ContactsService', inject(function (ContactsService) {
		expect(ContactsService).toBeDefined();
	}))

	describe('list', function () {

		it('should exist', inject(function (ContactsService) {
			expect(ContactsService.list).toBeDefined();
		}))

		it('should validate pager', inject(function (ContactsService) {
			var pagers = [
				{index: -1, size: undefined, valid: false },
				{index: -1, size: 0, valid: false },
				{index: -1, size: 1, valid: false },
				{index: 0, size: undefined, valid: false },
				{index: 0, size: -1, valid: false },
				{index: 0, size: 1, valid: true }
			];

			function validCheck(valid) {
				expect(valid ? 'valid pager' : 'pager').toEqual(valid ? 'valid pager' : 'valid');
			}

			angular.forEach(pagers, function (pager) {
				waitPromiseResult(ContactsService.list(pager.index, pager.size), function (res) {
					validCheck(pager.valid);
				}, function (err) {
					validCheck(!pager.valid);
				});
			})
		}))

		it('should order results', inject(function (ContactsService, LocalStorageService) {
			var c1 = {Name: 'Ivan', Surname: 'Petrov', Phone: '123', Group: ''};
			var c2 = {Name: 'Andrey', Surname: 'Bunin', Phone: '2', Group: 'Friend'};

			spyOn(LocalStorageService, 'get').andReturn([c1, c2]);

			var sortings = [
				{sort: {Field: 'Name', Desc: true}, res: [c1, c2]},
				{sort: {Field: 'Name', Desc: false}, res: [c2, c1]},
				{sort: {Field: 'Surname', Desc: true}, res: [c1, c2]},
				{sort: {Field: 'Surname', Desc: false}, res: [c2, c1]},
				{sort: {Field: 'Group', Desc: true}, res: [c2, c1]},
				{sort: {Field: 'Group', Desc: false}, res: [c1, c2]}
			];

			angular.forEach(sortings, function (s) {
				waitPromiseResult(ContactsService.list(0, 10, s.sort), function (res) {
					expect(res.Contacts).toEqual(s.res);
				}, function (err) {
					expect('error').toEqual('none');
				})
			})
		}))

		it('should search by name or surname', inject(function (ContactsService, LocalStorageService) {
			var c1 = {Name: 'Ivan', Surname: 'Petrov', Phone: '123', Group: ''};
			var c2 = {Name: 'Andrey', Surname: 'Bunin', Phone: '2', Group: 'Friend'};
			var c3 = {Name: 'John', Surname: 'Brown', Phone: '2', Group: 'Friend'};

			spyOn(LocalStorageService, 'get').andReturn([c1, c2, c3]);

			var queries = [
				{text: 'an', res: [c1, c2]},
				{text: 'B', res: [c2, c3]},
				{text: 'Friend', res: []}
			];

			angular.forEach(queries, function (q) {
				waitPromiseResult(ContactsService.list(0, 10, null, q.text), function (res) {
					expect(res.Contacts).toEqual(q.res);
				}, function (err) {
					expect('error').toEqual('none');
				})
			});
		}));
	})

	describe('save', function () {
		it('should exist', inject(function (ContactsService) {
			expect(ContactsService.save).toBeDefined();
		}))

		it('should validate fields', inject(function (ContactsService, LocalStorageService) {
			spyOn(LocalStorageService, 'put').andCallFake(function () {
			});

			var contacts = [
				{valid: false},
				{Name: null, valid: false},
				{Name: '', valid: false},
				{Name: '   ', valid: false},

				{Name: 'Ivan', valid: false},
				{Name: 'Ivan', Phone: null, valid: false},
				{Name: 'Ivan', Phone: '', valid: false},
				{Name: 'Ivan', Phone: '   ', valid: false},

				{Name: 'Ivan', Phone: ' 123  ', valid: true},
				{Name: 'Ivan', Phone: '123', valid: true}
			];

			function checkValid(validHere) {
				expect(validHere ? 'valid contact' : 'contact').toEqual(validHere ? 'valid contact' : 'valid');
			}

			angular.forEach(contacts, function (c) {
				waitPromiseResult(ContactsService.save(c), function (res) {
					checkValid(c.valid);
				}, function (err) {
					checkValid(!c.valid);
				})
			})
		}))

		it('should trim fields', inject(function (ContactsService, LocalStorageService) {
			spyOn(LocalStorageService, 'put').andCallFake(function () {
			});

			var c = {Name: ' Ivan ', Surname: ' Petrov ', Phone: '  12121   ', Group: ' Friend '};
			waitPromiseResult(ContactsService.save(c), function (res) {
				expect(res).toEqual({Id: 1, Name: 'Ivan', Surname: 'Petrov', Phone: '12121', Group: 'Friend'});
			}, function (err) {
				expect('error').toEqual('none');
			})
		}))

		it('should save', inject(function (LocalStorageService) {
			var existing = {Id: 1, Name: 'Existing', Phone: '1213'};

			var contacts = [existing];
			spyOn(LocalStorageService, 'get').andCallFake(function () {
				return angular.copy(contacts);
			})
			spyOn(LocalStorageService, 'put').andCallFake(function (key, value) {
				contacts = value;
			});

			inject(function (ContactsService) {
				var newContact = {Name: ' Ivan ', Surname: ' Petrov ', Phone: '  12121   ', Group: ' Friend '};
				waitPromiseResult(ContactsService.save(newContact), function (res) {
					expect(res.Id).toEqual(2);
				}, function (err) {
					expect('error').toEqual('none');
				})

				existing.Phone = '234';
				waitPromiseResult(ContactsService.save(existing), function (res) {
					expect(res.Id).toEqual(1);
					expect(res.Phone).toEqual('234');
				}, function (err) {
					expect('error').toEqual('none');
				})
			})
		}))
	})
})























