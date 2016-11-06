(function () {
  'use strict';

  describe('Userhistories Route Tests', function () {
    // Initialize global variables
    var $scope,
      UserhistoriesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UserhistoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UserhistoriesService = _UserhistoriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('userhistories');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/userhistories');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          UserhistoriesController,
          mockUserhistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('userhistories.view');
          $templateCache.put('modules/userhistories/client/views/view-userhistory.client.view.html', '');

          // create mock Userhistory
          mockUserhistory = new UserhistoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userhistory Name'
          });

          // Initialize Controller
          UserhistoriesController = $controller('UserhistoriesController as vm', {
            $scope: $scope,
            userhistoryResolve: mockUserhistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:userhistoryId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.userhistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            userhistoryId: 1
          })).toEqual('/userhistories/1');
        }));

        it('should attach an Userhistory to the controller scope', function () {
          expect($scope.vm.userhistory._id).toBe(mockUserhistory._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/userhistories/client/views/view-userhistory.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UserhistoriesController,
          mockUserhistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('userhistories.create');
          $templateCache.put('modules/userhistories/client/views/form-userhistory.client.view.html', '');

          // create mock Userhistory
          mockUserhistory = new UserhistoriesService();

          // Initialize Controller
          UserhistoriesController = $controller('UserhistoriesController as vm', {
            $scope: $scope,
            userhistoryResolve: mockUserhistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.userhistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/userhistories/create');
        }));

        it('should attach an Userhistory to the controller scope', function () {
          expect($scope.vm.userhistory._id).toBe(mockUserhistory._id);
          expect($scope.vm.userhistory._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/userhistories/client/views/form-userhistory.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UserhistoriesController,
          mockUserhistory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('userhistories.edit');
          $templateCache.put('modules/userhistories/client/views/form-userhistory.client.view.html', '');

          // create mock Userhistory
          mockUserhistory = new UserhistoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Userhistory Name'
          });

          // Initialize Controller
          UserhistoriesController = $controller('UserhistoriesController as vm', {
            $scope: $scope,
            userhistoryResolve: mockUserhistory
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:userhistoryId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.userhistoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            userhistoryId: 1
          })).toEqual('/userhistories/1/edit');
        }));

        it('should attach an Userhistory to the controller scope', function () {
          expect($scope.vm.userhistory._id).toBe(mockUserhistory._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/userhistories/client/views/form-userhistory.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
