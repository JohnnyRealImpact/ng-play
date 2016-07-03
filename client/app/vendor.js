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
  });
