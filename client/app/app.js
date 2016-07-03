'use strict';

angular.module('ngPlayApp', [
  'ngPlayApp.vendor',
  'ngPlayApp.theme',
  'ngPlayApp.router',
  'ngPlayApp.runtime',
])

  .filter('fromNow', function () {
    return function (dateString, format) {
      return moment(dateString).fromNow(format);
    };
  });

