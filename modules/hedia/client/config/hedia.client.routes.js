(function () {
  'use strict';

  angular
    .module('hedia')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('hedia', {
        abstract: true,
        url: '/hedia',
        template: '<ui-view/>'
      })
      .state('hedia.list', {
        url: '',
        templateUrl: 'modules/hedia/client/views/list-hedia.client.view.html',
        controller: 'HediaListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Hedia List'
        }
      })
      .state('hedia.create', {
        url: '/create',
        templateUrl: 'modules/hedia/client/views/form-hedium.client.view.html',
        controller: 'HediaController',
        controllerAs: 'vm',
        resolve: {
          hediumResolve: newHedium
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Hedia Create'
        }
      })
      .state('hedia.edit', {
        url: '/:hediumId/edit',
        templateUrl: 'modules/hedia/client/views/form-hedium.client.view.html',
        controller: 'HediaController',
        controllerAs: 'vm',
        resolve: {
          hediumResolve: getHedium
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Hedium {{ hediumResolve.name }}'
        }
      })
      .state('hedia.view', {
        url: '/:hediumId',
        templateUrl: 'modules/hedia/client/views/view-hedium.client.view.html',
        controller: 'HediaController',
        controllerAs: 'vm',
        resolve: {
          hediumResolve: getHedium
        },
        data: {
          pageTitle: 'Hedium {{ hediumResolve.name }}'
        }
      });
  }

  getHedium.$inject = ['$stateParams', 'HediaService'];

  function getHedium($stateParams, HediaService) {
    return HediaService.get({
      hediumId: $stateParams.hediumId
    }).$promise;
  }

  newHedium.$inject = ['HediaService'];

  function newHedium(HediaService) {
    return new HediaService();
  }
}());
