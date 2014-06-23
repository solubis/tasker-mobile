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

    .controller('AppController', function ($scope, $app, $account, $everlive) {

      console.log('AppController starting');

      $scope.credentials = $account.getUser();

      $scope.openLoginForm = function () {
        $app.popup('#login-form', true);
      };

      $scope.signUp = function () {
        $app.showIndicator();
        $account.signUp($scope.credentials.email, $scope.credentials.password)
            .then(function () {
              $app.closeModal('#login-form');
              $account.login($scope.credentials.email, $scope.credentials.password);
            })
            .catch(function (error) {
              $app.alert(error.message, 'Signup error');
            })
            .finally(function(){
              $app.hideIndicator();
            });
      };

      $scope.login = function () {
        $app.showIndicator();
        $account.login($scope.credentials.email, $scope.credentials.password)
            .then(function () {
              $app.closeModal('#login-form');
            })
            .catch(function (error) {
              $app.alert(error.message, 'Login error');
            })
            .finally(function(){
              $app.hideIndicator();
            });

      };

      $scope.logout = function () {
        $app.confirm('Are you sure you want to log out?', 'Logout', function () {
          $app.showIndicator();
          $account.logout()
              .then(function () {
                $scope.openLoginForm();
              })
              .catch(function (error) {
                $app.alert(error.message, 'Logout error');
              })
              .finally(function(){
                $app.hideIndicator();
              });
        });
      };

      $scope.setLoginForm = function(){
        $scope.isLoginForm = true;
        $scope.isSignupForm = false;
      };

      $scope.setSignupForm = function(){
        $scope.isLoginForm = false;
        $scope.isSignupForm = true;
      };

      $scope.$on('loadingData', function () {
        $app.showIndicator();
      });

      $scope.$on('finishedLoadingData', function () {
        $app.hideIndicator();
      });

      $scope.isLoggedIn = $account.isLoggedIn;
      $scope.user = $account.getUser();
      $scope.everlive = $everlive;

      $scope.setLoginForm();

      if (!$scope.isLoggedIn()){
        $scope.openLoginForm();
      }
    });

