(function () {
  'use strict';

  // Hedia controller
  angular
    .module('hedia')
    .controller('HediaController', HediaController);

  HediaController.$inject = ['$scope', '$state', '$window', 'Authentication', 'hediumResolve'];

  function HediaController ($scope, $state, $window, Authentication, hedium) {
    var vm = this;

    vm.authentication = Authentication;
    vm.hedium = hedium;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Hedium
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.hedium.$remove($state.go('hedia.list'));
      }
    }

    // Save Hedium
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.hediumForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.hedium._id) {
        vm.hedium.$update(successCallback, errorCallback);
      } else {
        vm.hedium.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('hedia.view', {
          hediumId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
