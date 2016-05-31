/**
 * Created by JohnathanLodder on 16/05/07.
 */
angular
  .module('ngPlayApp')
  .controller('AppCtrl', function ($rootScope, $scope, $timeout, $mdSidenav, $mdComponentRegistry, $log, $mdMedia) {

    // Listen for the 'toggle' event on the root scope
    $rootScope.$on('toggle', function (event, data) {
      if (data && data.name) {
        $log.debug(' - Toggle:', data); // 'Data to send'
        switch (data.state) {
          case true:
            $mdSidenav(data.name)
              .open()
              .then(function () {
                $log.debug(" - Opened '" + data.name + "' navigation");
              });
            break;
          case false:
            $mdSidenav(data.name)
              .close()
              .then(function () {
                $log.debug(" - Closed '" + data.name + "' navigation");
              });
            break;
          default:
            $mdSidenav(data.name)
              .toggle()
              .then(function () {
                $log.debug(" - Toggled '" + data.name + "' navigation");
              });
            break;
        }
      }
    });

    $scope.isMobile = function() {
      return !$mdMedia('gt-md');
    };

    $scope.isLeftOpen = function(target) {
      target = target || ($scope.isMobile() ? 'left' : 'left-static');
      try {
        var instance = $mdComponentRegistry.get(target);
        if (instance){
          return $mdSidenav(target).isOpen();
        }
      } catch (ex) {
        console.warn(ex.message);
      }
      return !$scope.isMobile();
    };

    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };

  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });
    };
  })
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      console.log('Emit Event....');
      $scope.$emit('toggle', { name: 'right', state: false});
    };
  });
