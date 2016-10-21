(function () {
  'use strict';

  angular
    .module('hedia')
    .controller('HediaListController', HediaListController);

  HediaListController.$inject = ['HediaService'];

  function HediaListController(HediaService) {
    var vm = this;

    vm.hedia = HediaService.query();
  }
}());
