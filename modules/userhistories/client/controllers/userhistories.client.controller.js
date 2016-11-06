(function () {
  'use strict';

  // Userhistories controller
  angular
    .module('userhistories')
    .controller('UserhistoriesController', UserhistoriesController);

  UserhistoriesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userhistoryResolve'];

  function UserhistoriesController ($scope, $state, $window, Authentication, userhistory) {
    var vm = this;

    vm.authentication = Authentication;
    vm.userhistory = userhistory;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Userhistory
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.userhistory.$remove($state.go('userhistories.list'));
      }
    }

    // Save Userhistory
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.userhistoryForm');
        return false;
      }


      // TODO: move create/update logic to service
      if (vm.userhistory._id) {
        vm.userhistory.$update(successCallback, errorCallback);
      } else {
        vm.userhistory.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('userhistories.view', {
          userhistoryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
