'use strict';

angular.module('ngPlayApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.getColor = function($index) {
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

    $scope.getSpan = function($index) {
      var _d = ($scope.awesomeThings.length > $index) ? $scope.awesomeThings[$index] : null;
      if (_d !== null) {
        return _d.featured ? 2 : 1;
      }
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
