angular.module('app.everlive', [])

    .factory('$utils', function ($q, $rootScope) {
      return {
        to$q: function (promise) {
          var deferred = $q.defer();

          promise.then(function (result) {
                deferred.resolve(result);
                $rootScope.$digest();
              }
              ,function (error) {
                deferred.reject(error);
                $rootScope.$digest();
              });

          return deferred.promise;
        }
      }
    })

    .factory('$everlive', function ($window) {
      var everlive, account = JSON.parse($window.localStorage.getItem('userProfile')) || {};

      everlive =  new Everlive({
        apiKey: 'QSyWwy2GY5YJ9KdV',
        token: account.token
      });

      return everlive;
    })

    .factory('$account', function ($rootScope, $everlive, $utils, $window) {

      var account = {},
          user = {};

      function clearUserProfile() {
        user.id = undefined;
        user.token = undefined;
        account.setUserInStore(user);
      }

      account.logout = function () {
        clearUserProfile();

        $rootScope.$broadcast('loggedOut');

        return $utils.to$q($everlive.Users.logout());
      };

      account.getUserFromStore = function () {
        return JSON.parse($window.localStorage.getItem('userProfile')) || {};
      };

      account.getUser = function () {
        return user;
      };

      account.setUserInStore = function(user){
        $window.localStorage.setItem('userProfile', JSON.stringify(user));
      };

      account.login = function (email, password) {
        return $utils.to$q($everlive.Users.login(email, password))
            .then(function (data) {
              user.token = data.result['access_token'];
              user.id = data.result['principal_id'];

              return $utils.to$q($everlive.Users.currentUser());
            })
            .then(function (data) {
              user.name = data.result.DisplayName;
              user.email = data.result.Username;

              account.setUserInStore(user);

              $rootScope.$broadcast('loggedIn');

              return user;
            });
      };

      account.signUp = function (email, password) {
        var profile = {
          Email: email,
          DisplayName: email,
          Role: 'authors'
        };

        return $utils.to$q($everlive.Users.register(email, password, profile));
      };

      account.remove = function () {
        return $utils.to$q($everlive.Users.destroySingle({Id: user.id}))
            .then(function () {
              clearUserProfile();
            });
      };

      account.isLoggedIn = function () {
        return user && user.id;
      };

      user = account.getUserFromStore();

      return account;
    })

    .factory('Store', function ($q, $everlive, $utils) {

      var Store = function (typeName) {
        this.type = $everlive.data(typeName);
      };

      Store.prototype.convert = function (record) {
        record._id = record.Id;
        return record;
      };

      Store.prototype.all = function () {
        var me = this;

        return $utils.to$q(this.type.get())
            .then(function (data) {
              var converted;

              converted = data.result.map(function (element) {
                return me.convert(element);
              });

              return converted;
            });
      };

      Store.prototype.get = function (obj) {
        var me = this,
            _id = (typeof obj === 'object' ? obj._id : obj);

        return $utils.to$q(this.type.getById(_id))
            .then(function (data) {
              return me.convert(data.result);
            });
      };

      Store.prototype.create = function (record) {
        var me = this;

        return $utils.to$q(this.type.create(record))
            .then(function (data) {
              return me.get(data.result.Id);
            });
      };

      Store.prototype.update = function (record) {
        return $utils.to$q(this.type.updateSingle(record))
            .then(function (data) {
              return record;
            });
      };

      Store.prototype.remove = function (record) {
        return $utils.to$q(this.type.destroySingle({ Id: record._id }));
      };

      Store.prototype.clean = function (record) {
        return $utils.to$q(this.type.destroy());
      };

      return Store;

    });

