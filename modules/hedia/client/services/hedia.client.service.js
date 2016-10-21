// Hedia service used to communicate Hedia REST endpoints
(function () {
  'use strict';

  angular
    .module('hedia')
    .factory('HediaService', HediaService);

  HediaService.$inject = ['$resource'];

  function HediaService($resource) {
    return $resource('api/hedia/:hediumId', {
      hediumId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
