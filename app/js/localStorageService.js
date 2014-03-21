var module = angular.module('LocalStorageModule', []);

module.factory('LocalStorageService', [function () {

	function checkStorageExists() {
		if (typeof (Storage) === 'undefined')
			throw  'Local storage is not available';
	}

	function getFullKey(key) {
		return 'address_book_' + key;
	}

	function checkKey(key) {
		if ($.type(key) !== 'string')
			throw  'Key is not valid';

		key = $.trim(key);

		if (!key)
			throw  'Key is not valid';

		return key;
	}

	return {
		put: function (key, value) {
			key = checkKey(key);

			checkStorageExists();

			var json = JSON.stringify(value);
			window.localStorage.setItem(getFullKey(key), json);
		},
		get: function (key) {
			key = checkKey(key);

			checkStorageExists();

			var json = window.localStorage.getItem(getFullKey(key));
			if (!json)
				return null;

			var res = JSON.parse(json);
			return res;
		},
		remove: function (key) {
			key = checkKey(key);

			checkStorageExists();

			window.localStorage.removeItem(getFullKey(key));
		}
	}
}])