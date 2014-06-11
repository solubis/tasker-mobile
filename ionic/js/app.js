angular.module('app', [
  'app.tasks',
  'app.filters',
  'app.services',
  'app.pouchdb',
  'ionic'
])
    .run(function ($ionicPlatform, $rootScope) {
      $ionicPlatform.ready(function () {
      });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
      $stateProvider

          .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "app.html"
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
              task: function ($stateParams, $db) {
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

    .factory('$db', function ($q, Database) {
      var $db = new Database('tasks');

      $db.populate = function () {
        var i,
            tasks = [
              'Opis scope i transclude',
              'Przywieźć drążek do podciągania z garażu',
              'Responsive tasker - Bootstrap, Everlive, Firebase'
            ],
            promises = [],
            today = new Date();

        for (i = 0; i < 20; i++) {

          var promise = this.create({
            name: i + ' - ' + chance.pick(tasks),
            date: chance.date({
              year: 2014,
              month: today.getMonth(),
              hour: 0,
              minute: 0,
              second: 0,
              millisecond: 0,
              string: false,
              american: false
            }),
            priority: chance.integer({
              min: 0,
              max: 2
            }),
            worked: chance.integer({
              min: 0,
              max: 100
            }),
            toComplete: chance.integer({
              min: 0,
              max: 100
            }),
            repeat: chance.integer({
              min: 0,
              max: 3
            }),
            description: chance.sentence({words: 10}),
            completed: chance.bool()
          });

          promises.push(promise);
        }

        return $q.all(promises);
      };

      $db.record = {
        name: 'New task',
        date: new Date(),
        priority: 0,
        worked: 0,
        toComplete: 0
      };

      return $db;
    });