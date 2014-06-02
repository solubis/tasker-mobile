angular.module('app', ['ionic', 'app.tasks', 'filters'])

    .run(function ($ionicPlatform, $rootScope) {

      var $scope = $rootScope;

      $ionicPlatform.ready(function () {

        $scope.filters = ['Today', 'Tomorrow', 'Next 7 days', 'All tasks', 'Done'];
        $scope.sorts = ['By Name', 'By Date', 'By Priority'];

        $scope.options = {
          filter: 3,
          sort: 1
        };

      });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider

          .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "app.html",
            controller: 'AppController'
          })

          .state('app.tasks', {
            url: "/tasks",
            views: {
              'content': {
                templateUrl: "partials/tasks.html",
                controller: 'TaskListController'
              }
            }
          })

          .state('app.single', {
            url: "/tasks/:id",
            resolve: {
              task: function($stateParams, $db){
                return $db.get($stateParams.id);
              }
            },
            views: {
              'content': {
                templateUrl: "partials/task.html",
                controller: 'TaskItemController'
              }
            }
          });

      $urlRouterProvider.otherwise('/app/tasks');
    })

    .controller('AppController', function($scope) {
    });

