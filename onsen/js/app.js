'use strict';

angular.module('app', [
  'app.tasks',
  'onsen.directives'
])

    .run(function ($rootScope) {
      var $scope = $rootScope;

      $scope.filters = ['Today', 'Tomorrow', 'Next 7 days', 'All tasks', 'Done'];
      $scope.sorts = ['By Name', 'By Date', 'By Priority'];

      $scope.options = {
        filter: 3,
        sort: 1
      };

    });