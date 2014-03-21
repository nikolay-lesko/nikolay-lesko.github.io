describe('Local Storage Service', function () {

	beforeEach(function () {
		angular.mock.module('LocalStorageModule');

		var store = { };
		spyOn(window.localStorage, 'setItem').andCallFake(function (key, value) {
			store[key] = value;
		});
		spyOn(window.localStorage, 'getItem').andCallFake(function (key) {
			return store[key];
		})
	});

	it('should exist', inject(function (LocalStorageService) {
		expect(LocalStorageService).toBeDefined();
	}));

	it('should throw on empty key', inject(function (LocalStorageService) {
		var values = [
			{value: undefined, throw: true},
			{value: null, throw: true},
			{value: false, throw: true},
			{value: true, throw: true},
			{value: [1, 2], throw: true},
			{value: '', throw: true},
			{value: '    ', throw: true},
			{value: '   some_key ', throw: false}
		];

		angular.forEach(['get', 'put', 'remove'], function (methodName) {
			angular.forEach(values, function (v) {
				var method = function () {
					return LocalStorageService[methodName](v.value);
				};

				if (v.throw)
					expect(method).toThrow();
				else
					expect(method).not.toThrow();
			})
		});
	}));

	it('should return same value', inject(function (LocalStorageService) {
		LocalStorageService.put('object', {'name': 'user'});
		LocalStorageService.put('string', 'some ');
		LocalStorageService.put('bool', true);
		LocalStorageService.put('array', [1, 2, 3]);

		expect(LocalStorageService.get('object')).toEqual({name: 'user'});
		expect(LocalStorageService.get('string')).toEqual('some ');
		expect(LocalStorageService.get('bool')).toEqual(true);
		expect(LocalStorageService.get('array')).toEqual([1, 2, 3]);
	}))
})
