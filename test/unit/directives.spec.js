describe('Directive', function () {
	var scope;
	var compile;

	beforeEach(function () {
		angular.mock.module('Directives');

		inject(function ($rootScope, $compile) {
			scope = $rootScope.$new();
			compile = $compile;
		})
	})

	describe('Validation Highlight', function () {
		var parent;
		var element;

		beforeEach(function () {
			scope.Name = null;
			scope.IsSubmitting = false;

			var form = angular.element('<form name="form"></form>');
			parent = angular.element('<div class="form-group"></div>');
			form.append(parent);

			element = angular.element('<input type="text" name="name" ng-model="Name" required validation-highlight />');
			parent.append(element);

			compile(form)(scope);
		})

		it('should have attribute "name"', function () {
			element = angular.element('<input type="text" ng-model="Name" required validation-highlight />');
			function doCompile() {
				compile(element)(scope);
			}

			expect(doCompile).toThrow();
		})

		it('should validate on submit', function () {
			scope.IsSubmitting = true;
			scope.$digest();

			expect(parent.hasClass('has-error')).toEqual(true);
		})

		it('should not show error on valid submit', function () {
			scope.Name = 'some';
			scope.IsSubmitting = true;
			scope.$digest();

			expect(parent.hasClass('has-error')).toEqual(false);

			scope.Name = '';
			scope.IsSubmitting = true;
			scope.$digest();

			expect(parent.hasClass('has-error')).toEqual(true);
		})
	})

	describe('Sort Field', function () {
		var element;

		beforeEach(function () {
			scope.SortFor = 'Name';
			scope.CurrentFor = '';
			scope.SortDesc = false;

			element = angular.element('<sort-field for="{{SortFor}}" current="CurrentFor" desc="SortDesc">Name</sort-field>');

			compile(element)(scope);
		})

		it('should be hidden for different current', function () {
			expect(element.find('button').css('visibility')).not.toEqual('visible');
		})

		it('should be visible for current', function () {
			scope.SortFor = 'Name';
			scope.CurrentFor = 'Name';
			scope.$digest();

			expect(element.find('button').css('visibility')).toEqual('visible');
		})

		it('should change dir by clicking', function () {
			scope.SortDesc = true;
			scope.$digest();

			// switch to annother Current (not it is '' and SortFor is 'Name') and reset SortDesc to false
			element.find('.sort-field').click();
			expect(scope.SortDesc).toEqual(false);

			// change SortDesc while Current is the same
			var old = scope.SortDesc;
			element.find('.sort-field').click();
			expect(scope.SortDesc).toEqual(!old);
		})
	})
})


























