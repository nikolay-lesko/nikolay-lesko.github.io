var module = angular.module('DirectivesModule', []);

function createPropertiesWatch(scope, names, watchProperties, callback) {
	names = stringToArray(names);
	watchProperties = stringToArray(watchProperties);

	angular.forEach(names, function (name) {
		var watchPath = 'form.' + name;
		var expr = '';

		angular.forEach(watchProperties, function (prop) {
			if (expr != '')
				expr += '+';

			expr += watchPath + '.' + prop;
		})

		scope.$watch(expr, function (n) {
			return function () {
				var el = scope.form[n];

				callback(el);
			}
		}(name));
	});
}

function createValidationPropertiesWatch(scope, names, callback) {

	function watchCallback(watchScope) {
		var invalid = watchScope.$invalid && (watchScope.$dirty || scope.IsSubmitting);

		callback(watchScope, invalid);
	}

	createPropertiesWatch(scope, names, ['$valid', '$dirty'], watchCallback);

	var namesArr = stringToArray(names);
	scope.$watch('IsSubmitting', function () {
		angular.forEach(namesArr, function (n) {
			var el = scope.form[n];

			watchCallback(el);
		})
	});
}

module.directive('validationHighlight', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var name = attrs.name;
			if (!name)
				throw  'validation-highlight: Element should have property "name"';

			var parentSelector = $.trim(attrs.validationHighlight);
			var parent = parentSelector == 'parent' ? element.parent() : element.closest(parentSelector || '.form-group');
			if (!parent.length)
				parent = element.parent();

			createValidationPropertiesWatch(scope, name, function (watchScope, invalid) {
				if (invalid)
					parent.addClass('has-error');
				else
					parent.removeClass('has-error');
			});
		}
	}
})

module.directive('progressIndicator', [function () {
	return {
		restrict: 'E',
		template: '<div class="loading">' +
			'           <div class="background"></div>' +
			'           <div class="content">' +
			'               <img src="./css/img/loading.gif"/>' +
			'           </div>' +
			'</div>'
	}
}])

module.directive('sortField', [function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			for: '@',
			current: '=',
			desc: '='
		},
		template: '' +
			'<span class="sort-field" ng-click="onToggleClick()" ng-class="{ active: current == for }" style="cursor:pointer">' +
			'   <span ng-transclude ></span> ' +
			'   <button class="btn btn-default glyphicon "' +
			'           ng-class="getButtonClass()" ' +
			'           ng-style="getButtonStyle()"></button>' +
			'</span>',
		link: function (scope, element, attrs) {
			if (!scope.desc)
				scope.desc = false;

			scope.onToggleClick = function () {
				if (scope.current != scope.for) {
					scope.current = scope.for;
					scope.desc = false;
				}
				else
					scope.desc = !scope.desc;
			};

			scope.getButtonStyle = function () {
				var style = {
					visibility: scope.current == scope.for ? 'visible' : 'collapse'
				};

				return style;
			};

			scope.getButtonClass = function () {
				return scope.desc
					? 'glyphicon-sort-by-attributes-alt'
					: 'glyphicon-sort-by-attributes';
			};

			scope.getContentStyle = function () {
				var style = {
					cursor: scope.for != scope.current ? 'pointer' : ''
				}
				return style;
			};
		}
	}
}])