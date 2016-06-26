'use strict';

angular.module('ngPlayApp')
  .controller('MainCtrl', function ($rootScope, $scope, $http, $state, cliProxy, appRuntime) {

    //$scope.appRuntime = appRuntime;
    $scope.awesomeThings = appRuntime.getAwesomeThings();
    $scope.deleteThing = appRuntime.deleteAwesomeThing;

    $scope.getColor = function ($index) {
      var bg = '';
      var _d = $scope.awesomeThings.length > $index ? $scope.awesomeThings[$index] : null;
      if (_d !== null) {
        if (!_d.active) {
          bg = 'gray';
        } else if (_d.featured) {
          bg = 'green';
        } else {
          bg = 'deepBlue';
        }
      }

      return bg;
    };

    $scope.getSpan = function ($index) {
      var _d = ($scope.awesomeThings.length > $index) ? $scope.awesomeThings[$index] : null;
      if (_d !== null) {
        return _d.featured ? 2 : 1;
      }
    };

    $scope.select = function (item) {
      console.info(' - Select:', item);
      $state.go('app.info', item);
    }

  });
