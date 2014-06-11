angular.module('app.tasks', ['app.pouchdb'])

    .controller('TaskListController', function ($scope, $filter, $db, $timeout) {

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

    .controller('TaskFormController', function ($scope, $db, $dictionary) {

      $scope.formData = angular.copy($scope.task);

      $scope.remove = function (task) {
          $scope.$parent.remove(task);
      };

      $scope.complete = function (task) {
        $scope.$parent.complete(task);
      };

      $scope.update = function () {
        console.log('scope', $scope.$id);
        angular.copy($scope.formData, $scope.task);

        $db.update($scope.task)
            .catch(function (error) {
              console.log('Error (' + error.name + ') : ' + error.message);
            });
      };

      $scope.priorities = $dictionary.priorities;

    });

