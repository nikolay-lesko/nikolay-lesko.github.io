describe('Local Storage Service', function () {

	beforeEach(function () {
		angular.mock.module('LocalStorage');

		var store = { };
		spyOn(window.localStorage, 'setItem').andCallFake(function (key, value) {
			store[key] = value;
		});
		spyOn(window.localStorage, 'getItem').andCallFake(function (key) {
			return store[key];
		})
	});

	it('should exist', inject(function (LocalStorage) {
		expect(LocalStorage).toBeDefined();
	}));

	it('should throw on empty key', inject(function (LocalStorage) {
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
					return LocalStorage[methodName](v.value);
				};

				if (v.throw)
					expect(method).toThrow();
				else
					expect(method).not.toThrow();
			})
		});
	}));

	it('should return same value', inject(function (LocalStorage) {
		LocalStorage.put('object', {'name': 'user'});
		LocalStorage.put('string', 'some ');
		LocalStorage.put('bool', true);
		LocalStorage.put('array', [1, 2, 3]);

		expect(LocalStorage.get('object')).toEqual({name: 'user'});
		expect(LocalStorage.get('string')).toEqual('some ');
		expect(LocalStorage.get('bool')).toEqual(true);
		expect(LocalStorage.get('array')).toEqual([1, 2, 3]);
	}))
})
