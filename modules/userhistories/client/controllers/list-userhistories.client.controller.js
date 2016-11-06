(function () {
  'use strict';

  angular
    .module('userhistories')
    .controller('UserhistoriesListController', UserhistoriesListController);

  UserhistoriesListController.$inject = ['UserhistoriesService'];

  function UserhistoriesListController(UserhistoriesService) {
    var vm = this;

    vm.userhistories = UserhistoriesService.query();
  }
}());
