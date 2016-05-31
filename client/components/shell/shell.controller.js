'use strict';

angular.module('ngPlayApp')
  .controller('ShellCtrl', function ($mdSidenav, $mdDialog, $scope, $location, $mdMedia, $mdComponentRegistry) {

    $scope.isActive = function(route) {
      return route === $location.path();
    };

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

    var originatorEv;
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    $scope.notificationsEnabled = true;
    $scope.toggleNotifications = function() {
      $scope.notificationsEnabled = !$scope.notificationsEnabled;
    };

    $scope.redial = function() {
      $mdDialog.show(
        $mdDialog.alert()
          .targetEvent(originatorEv)
          .clickOutsideToClose(true)
          .parent('body')
          .title('Suddenly, a redial')
          .content('You just called a friend; who told you the most amazing story. Have a cookie!')
          .ok('That was easy')
        );
      originatorEv = null;
    };

    $scope.checkVoicemail = function() {
      // This never happens.
    };

    $scope.showAddDialog = function($event) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl: 'components/shell/dialog/dialog.html',
        controller: 'DialogController'
      });
    };
  });
