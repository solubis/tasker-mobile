angular.module('app.tasks', ['app.pouchdb'])

    .controller('TaskListController', function ($scope, $filter, $db, $app, $timeout) {

      $scope.nameOfScope = 'TaskListController';

      $scope.order = '+date';
      $scope.period = 'all';
      $scope.group = 'date';

      // Public methods

      $scope.init = function () {
        console.log('TaskListController Initializing...');
        $db.all()
            .then(function (result) {
              $scope.tasks = result;
            })
            .
            catch(function (error) {
              console.log('Error (' + error.name + ') : ' + error.message);
            });
      };

      $scope.actions = function (task) {
        var actions, title, status, cancel, tomorrow;

        title = {
          text: 'What would you like to do with this task?',
          label: true
        };

        status = {
          red: true,
          onClick: function () {
            $scope.$apply(function () {
              $scope.complete(task);
            });
            $app.swipeoutClose($app.swipeoutOpenedEl);
          }
        };

        tomorrow = {
          text: 'Do it tomorrow',
          onClick: function () {
            $scope.$apply(function () {
              task.date.setDate(task.date.getDate() + 1);
            });
            $app.swipeoutClose($app.swipeoutOpenedEl);
          }
        };

        cancel = {
          text: 'Cancel',
          bold: true,
          onClick: function () {
            $app.swipeoutClose($app.swipeoutOpenedEl);
          }
        };

        if (task.completed) {
          status.text = 'Activate';
          $app.actions([
            [
              title,
              status
            ],
            [
              cancel
            ]
          ]);
        } else {
          status.text = 'Complete';
          $app.actions([
            [
              title,
              status,
              tomorrow
            ],
            [
              cancel
            ]
          ]);
        }
      };

      $scope.remove = function (task) {
        $db.remove(task)
            .then(function () {
              $timeout(function () {
                $scope.tasks.splice($scope.tasks.indexOf(task), 1);
              }, 100); // najpierw swipe-to-delete musi zadziałać
            })
            .catch(function (error) {
              var message = 'Error (' + error.name + ') : ' + error.message;
              console.log(message);
              $app.alert(message);
            });
      };

      $scope.complete = function (task) {
        task.completed = !task.completed;
      };

      $scope.populate = function () {
        console.log('Populating');
        return $db.clean()
            .then(function () {
              return $db.populate();
            })
            .then(function (result) {
              $scope.tasks = result;
            })
            .catch(function (error) {
              console.log('Error (' + error.name + ') : ' + error.message);
            });
      };

      $scope.refresh = $scope.populate;

      $scope.$on('changeOrder', function (event, value) {
        $scope.changeOrder(value);
      });

      $scope.changeOrder = function (value) {
        $scope.order = value;

        if ($scope.order && $scope.order.indexOf('date') >= 0 || $scope.order.indexOf('priority') >= 0) {
          $scope.group = $scope.order.substr(1);
        } else {
          $scope.group = null;
        }
      };

      $scope.changePeriod = function (index) {
        $scope.period = ['today', 'week', 'all'][index];
      };


      $scope.init();
    })

    .controller('TaskFormController', function ($scope, $db, $app, $navigator, $dictionary) {

      $scope.nameOfScope = 'TaskFormController';
      $scope.isNew = $scope.task === undefined;

      if (!$scope.isNew) {
        $scope.formData = angular.copy($scope.task);
      } else {
        $scope.formData = angular.copy($db.record);
      }

      $scope.remove = function (task) {
        $app.confirm('TaskFormController', 'Delete task?', function () {
          $scope.$parent.remove(task);
          $navigator.goBack();
        });
      };

      $scope.complete = function (task) {
        $scope.$parent.complete(task);
        $navigator.goBack();
      };

      $scope.update = function () {
        if ($scope.taskForm.$invalid) {
          $app.alert('Please provide name for task', 'Task definition incomplete');
          return;
        }

        if ($scope.isNew) {
          $db.create($scope.formData)
              .then(function (result) {
                $scope.tasks.push(result);
              })
              .catch(function (error) {
                console.log('Error (' + error.name + ') : ' + error.message);
              });
        } else {
          $db.update($scope.formData)
              .then(function (result) {
                angular.copy($scope.formData, $scope.task);
              })
              .catch(function (error) {
                console.log('Error (' + error.name + ') : ' + error.message);
              });

        }
        $navigator.goBack();

      };

      $scope.priorities = $dictionary.priorities;

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

