angular.module('app.tasks', ['app.pouchdb'])

    .controller('TaskListController', function ($scope, $filter, $db, $app, $timeout) {

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
        if (task.completed) {
          $app.actions([
            [
              // Group Label
              {
                text: 'What would you like to do with this task?',
                label: true
              },
              {
                text: 'Activate',
                red: true,
                onClick: function () {
                  $scope.$apply(function () {
                    $scope.complete(task);
                  });
                  $app.swipeoutClose($app.swipeoutOpenedEl);
                }
              }
            ],
            // Cancel group
            [
              {
                text: 'Cancel',
                bold: true
              }
            ]
          ]);
        } else {
          $app.actions([
            [
              // Group Label
              {
                text: 'What would you like to do with this task?',
                label: true
              },
              {
                text: 'Complete',
                red: true,
                onClick: function () {
                  $scope.$apply(function () {
                    $scope.complete(task);
                  });
                  $app.swipeoutClose($app.swipeoutOpenedEl);
                }
              },
              {
                text: 'Do it tomorrow',
                onClick: function () {
                  task.date.setDate(task.date.getDate() + 1);
                }
              }
            ],
            // Second group
            [
              {
                text: 'Cancel',
                bold: true
              }
            ]
          ]);
        }
      };

      $scope.create = function () {
        var record = $db.record;

        $db.create(record)
            .then(function (record) {
              $scope.tasks.unshift(record);
            })
            .
            catch(function (error) {
              console.log('Error (' + error.name + ') : ' + error.message);
            });
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

      // UI actions event handling

      $scope.$on('addItem', $scope.create);

      $scope.$on('populateDatabase', $scope.populate);

      $scope.$on('changeOrder', function (value) {
        $scope.order = value;

        if ($scope.order && $scope.order.contains('date') || $scope.order.contains('priority')) {
          $scope.group = $scope.order.substr(1);
        } else {
          $scope.group = null;
        }
      });

      $scope.$on('changePeriod', function setFilter(value) {
        $scope.period = value;
      });

      $scope.init();
    })

    .controller('TaskFormController', function ($scope, $db, $app, $navigator, $dictionary) {

      $scope.formData = angular.copy($scope.task);

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
        console.log('scope', $scope.$id);
        angular.copy($scope.formData, $scope.task);
        $navigator.goBack();

        $db.update($scope.task)
            .catch(function (error) {
              console.log('Error (' + error.name + ') : ' + error.message);
            });
      };

      $scope.priorities = $dictionary.priorities;

    });

