/**
 * Created by JohnathanLodder on 16/07/03.
 */

angular.module('ngPlayApp.vendor', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ngMessages',
  'ngMaterial',
  'ngMoment',
])

  // Moment as a filter
  .filter('fromNow', function () {
    return function (dateString, format) {
      return moment(dateString).fromNow(format);
    };
  })

  // Enable enter command on inputs
  .directive('cmdEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          try {
            scope.$eval(attrs.cmdEnter);
          } catch (ex) {
            console.error('Command evaluation failed: ', attrs.cmdEnter);
          }
          event.preventDefault();
          return false;
        }
      });
    };
  });
