'use strict';

describe('Hedia E2E Tests:', function () {
  describe('Test Hedia page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/hedia');
      expect(element.all(by.repeater('hedium in hedia')).count()).toEqual(0);
    });
  });
});
