describe('utils', function () {
	describe('stringToArray', function () {

		it('should parse only strings', function () {
			expect(stringToArray(1)).toBe(1);
			expect(stringToArray(true)).toBe(true);
			expect(stringToArray([1, 2])).toEqual([1, 2]);
		})

		it('should treat null,undefined and empty string as empty array', function () {
			expect(stringToArray(null)).toEqual([]);
			expect(stringToArray(undefined)).toEqual([]);
			expect(stringToArray()).toEqual([]);
			expect(stringToArray('')).toEqual([]);
		})

		it('should parse valid string', function () {
			expect(stringToArray('name, phone, email')).toEqual(['name', 'phone', 'email'])

		})

		it('should trim parsed strings', function () {
			expect(stringToArray(' name, phone   , email      ')).toEqual(['name', 'phone', 'email'])
		})

		it('should remove empty items', function () {
			expect(stringToArray(', , ')).toEqual([]);
		})
	})
})
