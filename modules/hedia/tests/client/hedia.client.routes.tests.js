(function () {
  'use strict';

  describe('Hedia Route Tests', function () {
    // Initialize global variables
    var $scope,
      HediaService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _HediaService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      HediaService = _HediaService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('hedia');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/hedia');
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
          HediaController,
          mockHedium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('hedia.view');
          $templateCache.put('modules/hedia/client/views/view-hedium.client.view.html', '');

          // create mock Hedium
          mockHedium = new HediaService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Hedium Name'
          });

          // Initialize Controller
          HediaController = $controller('HediaController as vm', {
            $scope: $scope,
            hediumResolve: mockHedium
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:hediumId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.hediumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            hediumId: 1
          })).toEqual('/hedia/1');
        }));

        it('should attach an Hedium to the controller scope', function () {
          expect($scope.vm.hedium._id).toBe(mockHedium._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/hedia/client/views/view-hedium.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          HediaController,
          mockHedium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('hedia.create');
          $templateCache.put('modules/hedia/client/views/form-hedium.client.view.html', '');

          // create mock Hedium
          mockHedium = new HediaService();

          // Initialize Controller
          HediaController = $controller('HediaController as vm', {
            $scope: $scope,
            hediumResolve: mockHedium
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.hediumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/hedia/create');
        }));

        it('should attach an Hedium to the controller scope', function () {
          expect($scope.vm.hedium._id).toBe(mockHedium._id);
          expect($scope.vm.hedium._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/hedia/client/views/form-hedium.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          HediaController,
          mockHedium;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('hedia.edit');
          $templateCache.put('modules/hedia/client/views/form-hedium.client.view.html', '');

          // create mock Hedium
          mockHedium = new HediaService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Hedium Name'
          });

          // Initialize Controller
          HediaController = $controller('HediaController as vm', {
            $scope: $scope,
            hediumResolve: mockHedium
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:hediumId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.hediumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            hediumId: 1
          })).toEqual('/hedia/1/edit');
        }));

        it('should attach an Hedium to the controller scope', function () {
          expect($scope.vm.hedium._id).toBe(mockHedium._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/hedia/client/views/form-hedium.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
