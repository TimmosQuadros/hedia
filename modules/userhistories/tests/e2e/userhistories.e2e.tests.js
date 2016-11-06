'use strict';

describe('Userhistories E2E Tests:', function () {
  describe('Test Userhistories page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/userhistories');
      expect(element.all(by.repeater('userhistory in userhistories')).count()).toEqual(0);
    });
  });
});
