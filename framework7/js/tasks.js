'use strict';

angular.module('app.tasks', ['app.pouchdb'])

    .controller('TaskListController', function ($scope, $filter, $db, $app, $dictionary) {

      $scope.order = '+date';
      $scope.period = 'all';
      $scope.group = 'date';

      // Public methods

      $scope.init = function () {
        console.log('TaskListController Initializing...');
        $db.all()
            .then(function (result) {
              $scope.tasks = $scope.original = result;
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
                  $scope.$apply(function(){
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
                  $scope.$apply(function(){
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

      $scope.remove = function (task, index) {
        $db.remove(task)
            .then(function () {
              $scope.tasks.splice(index, 1);
            })
            .catch(function (error) {
              console.log('Error (' + error.name + ') : ' + error.message);
            });
      };

      $scope.complete = function (task) {
        task.completed = !task.completed;
      };

      $scope.populate = function () {
        $db.clean()
            .then(function () {
              return $db.populate();
            })
            .then(function (result) {
              $scope.tasks = result;
            })
            .
            catch(function (error) {
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

    .controller('TaskFormController', function ($scope, $db, $filter, $app, $navigator, $dictionary) {

      $scope.formData = angular.copy($scope.task);

      $scope.complete = function () {
        $scope.task.done = !$scope.task.done;
      };

      $scope.update = function (event) {
        angular.copy($scope.formData, $scope.task);
        $navigator.goBack();

        $db.update($scope.task)
            .then(function () {

            })
            .catch(function (error) {
              console.log('Error (' + error.name + ') : ' + error.message);
            });
      };

      $scope.priorities = $dictionary.priorities;

    });

