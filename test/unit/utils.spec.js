describe('utils', function () {

    var utils;

    beforeEach(function () {
        angular.mock.module('Utils');

        inject(function (Utils) {
            utils = Utils;
        })
    })

    describe('stringToArray', function () {

        it('should parse only strings', function () {
            expect(utils.stringToArray(1)).toBe(1);
            expect(utils.stringToArray(true)).toBe(true);
            expect(utils.stringToArray([1, 2])).toEqual([1, 2]);
        })

        it('should treat null,undefined and empty string as empty array', function () {
            expect(utils.stringToArray(null)).toEqual([]);
            expect(utils.stringToArray(undefined)).toEqual([]);
            expect(utils.stringToArray()).toEqual([]);
            expect(utils.stringToArray('')).toEqual([]);
        })

        it('should parse valid string', function () {
            expect(utils.stringToArray('name, phone, email')).toEqual(['name', 'phone', 'email'])

        })

        it('should trim parsed strings', function () {
            expect(utils.stringToArray(' name, phone   , email      ')).toEqual(['name', 'phone', 'email'])
        })

        it('should remove empty items', function () {
            expect(utils.stringToArray(', , ')).toEqual([]);
        })
    })
})
