describe("index", function () {

	it('should navigate to login', function () {

		browser.manage().deleteAllCookies();
		browser.get('#/contacts');

		expect(browser.getCurrentUrl()).toContain('#/login');
	})
})