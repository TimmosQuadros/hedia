(function () {
  'use strict';

  angular
    .module('userhistories')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('userhistories', {
        abstract: true,
        url: '/userhistories',
        template: '<ui-view/>'
      })
      .state('userhistories.list', {
        url: '',
        templateUrl: 'modules/userhistories/client/views/list-userhistories.client.view.html',
        controller: 'UserhistoriesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'User Histories List'
        }
      })
      .state('userhistories.create', {
        url: '/create',
        templateUrl: 'modules/userhistories/client/views/form-userhistory.client.view.html',
        controller: 'UserhistoriesController',
        controllerAs: 'vm',
        resolve: {
          userhistoryResolve: newUserhistory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'User Histories Create'
        }
      })
      .state('userhistories.edit', {
        url: '/:userhistoryId/edit',
        templateUrl: 'modules/userhistories/client/views/form-userhistory.client.view.html',
        controller: 'UserhistoriesController',
        controllerAs: 'vm',
        resolve: {
          userhistoryResolve: getUserhistory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Userhistory {{ userhistoryResolve.name }}'
        }
      })
      .state('userhistories.view', {
        url: '/:userhistoryId',
        templateUrl: 'modules/userhistories/client/views/view-userhistory.client.view.html',
        controller: 'UserhistoriesController',
        controllerAs: 'vm',
        resolve: {
          userhistoryResolve: getUserhistory
        },
        data: {
          pageTitle: 'Userhistory {{ userhistoryResolve.name }}'
        }
      });
  }

  getUserhistory.$inject = ['$stateParams', 'UserhistoriesService'];

  function getUserhistory($stateParams, UserhistoriesService) {
    return UserhistoriesService.get({
      userhistoryId: $stateParams.userhistoryId
    }).$promise;
  }

  newUserhistory.$inject = ['UserhistoriesService'];

  function newUserhistory(UserhistoriesService) {
    return new UserhistoriesService();
  }
}());
