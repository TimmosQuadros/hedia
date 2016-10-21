(function () {
  'use strict';

  // PasswordValidator service used for testing the password strength
  angular
    .module('users.services')
    .factory('PasswordValidator', PasswordValidator);

  PasswordValidator.$inject = ['$window'];

  function PasswordValidator($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    owaspPasswordStrengthTest.config({
              allowPassphrases       : true,
              maxLength              : 128,
              minLength              : 4,
              minOptionalTestsToPass : 1,
              minPhraseLength        : 4});

    var service = {
      getResult: getResult,
      getPopoverMsg: getPopoverMsg
    };

    return service;

    function getResult(password) {
      var result = owaspPasswordStrengthTest.test(password);
      return result;
    }

    function getPopoverMsg() {
      var popoverMsg = 'Please enter a passphrase or password with ' + owaspPasswordStrengthTest.configs.minLength + ' or more characters, numbers, lowercase, uppercase, and special characters.';

      return popoverMsg;
    }
  }

}());
