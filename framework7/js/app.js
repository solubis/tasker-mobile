angular.module('app', [
  'app.tasks',
  'app.filters',
  'app.services',
  'app.everlive',
  'framework7'
])
    .config(function ($navigatorProvider) {
      $navigatorProvider.page('task-form', {
        controller: 'TaskFormController'
      });
    })

    .controller('AppController', function ($scope, $app, $account) {
      $scope.credentials = {};

      $scope.openLoginForm = function () {
        $app.popup('#login-form', true);
      };

      $scope.signUp = function () {
        $account.signUp($scope.credentials.email, $scope.credentials.email, $scope.credentials.password);
      };

      $scope.login = function () {
        $account.login($scope.credentials.email, $scope.credentials.password);
      };

    });

