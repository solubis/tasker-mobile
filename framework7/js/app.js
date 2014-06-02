angular.module('app', [
  'app.tasks',
  'app.filters',
  'app.services',
  'app.pouchdb',
  'framework7'
])

    .run(function ($rootScope, $navigator, $app) {
      console.log('Run');

    })

    .config(function ($navigatorProvider) {

      console.log('Config');

      $navigatorProvider.page('taskForm', {
        controller: 'TaskFormController',
        templateUrl: 'partials/task-form.html'
      });

      $navigatorProvider.page('taskList', {
        controller: 'TaskListController',
        templateUrl: 'partials/task-list.html'
      });

      $navigatorProvider.page('test', {
        templateUrl: 'partials/test.html',
        resolve: {
          message: function () {
            return 'Hello!';
          }
        }
      });

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
            today = new Date(),
            date;

        date = chance.date({
          year: 2014,
          month: today.getMonth(),
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
          string: false,
          american: false
        }).getTime();

        for (i = 0; i < 100; i++) {

          var promise = this.create({
            name: i + ' - ' + chance.pick(tasks),
            date: date,
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

