// Userhistories service used to communicate Userhistories REST endpoints
(function () {
  'use strict';

  angular
    .module('userhistories')
    .factory('UserhistoriesService', UserhistoriesService);

  UserhistoriesService.$inject = ['$resource'];

  function UserhistoriesService($resource) {
    return $resource('/api/userhistories/:userhistoryId', {
      userhistoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
