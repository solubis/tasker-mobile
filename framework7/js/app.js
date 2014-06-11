angular.module('app', [
  'app.tasks',
  'app.filters',
  'app.services',
  'app.pouchdb',
  'framework7'
])
    .config(function ($navigatorProvider) {
      $navigatorProvider.page('task-form', {
        controller: 'TaskFormController'
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
        description: '',
        completed: false
      };

      return $db;
    });

