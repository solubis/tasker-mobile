angular.module('app.everlive', [])

    .factory('$utils', function ($q, $rootScope) {
      return {
        to$q: function (promise) {
          var deferred = $q.defer();

          promise.then(function (result) {
                deferred.resolve(result);
                $rootScope.$digest();
              }
              , function (error) {
                deferred.reject(error);
                $rootScope.$digest();
              });

          return deferred.promise;
        }
      }
    })

    .factory('$everlive', function () {
      return new Everlive({
        apiKey: 'QSyWwy2GY5YJ9KdV',
        token: localStorage.getItem("token")
      });
    })

    .factory('$account', function ($rootScope, $everlive, $utils) {

      var account = {};

      account.logout = function () {
        return $utils.to$q($everlive.Users.logout())
            .then(function () {
              $rootScope.user = null;
            })
            .catch(function (error) {
              console.log(JSON.stringify(error));
            });
      };

      account.loadProfile = function () {
        return $utils.to$q($everlive.Users.currentUser())
            .then(function (data) {
              console.log(JSON.stringify(data));
              $rootScope.user = {
                name: data.result.DisplayName
              };
            })
            .catch(function (error) {
              console.log(JSON.stringify(error));
            });
      };

      account.login = function (email, password) {
        return $utils.to$q($everlive.Users.login(email, password))
            .then(function (data) {
              localStorage.setItem("token", data.result['access_token']);
              account.loadProfile();
            })
            .catch(function (error) {
              console.log(JSON.stringify(error));
            });
      };

      account.signUp = function (name, email, password) {
        var user = {
          Email: email,
          DisplayName: name,
          Role: 'authors'
        };

        return $utils.to$q($everlive.Users.register(email, password, user))
            .then(function () {
              account.login(email, password);
            })
            .catch(function (error) {
              console.log(JSON.stringify(error));
            });
      };

      account.isLoggedIn = function () {
        return $rootScope.user;
      };

      account.loadProfile();

      return account;
    })

    .factory('Database', function ($q, $everlive, $utils) {

      var Database = function (typeName) {
        this.type = $everlive.data(typeName);
      };

      Database.prototype.convert = function (record) {
        record._id = record.Id;
        return record;
      };

      Database.prototype.all = function () {
        var me = this;

        return $utils.to$q(this.type.get())
            .then(function (data) {
              var converted;

              converted = data.result.map(function (element) {
                return me.convert(element);
              });

              return converted;
            })
            .catch(function (error) {
              console.log(JSON.stringify(error));
            });
      };

      Database.prototype.get = function (obj) {
        var me = this,
            _id = (typeof obj === 'object' ? obj._id : obj);

        return $utils.to$q(this.type.getById(_id))
            .then(function (data) {
              return me.convert(data.result);
            })
            .catch(function (error) {
              console.log(JSON.stringify(error));
            });
      };

      Database.prototype.create = function (record) {
        var me = this;

        return $utils.to$q(this.type.create(record))
            .then(function (data) {
              return me.get(data.result.Id);
            })
            .catch(function (error) {
              console.log(JSON.stringify(error));
            });
      };

      Database.prototype.update = function (record) {
        return $utils.to$q(this.type.updateSingle(record))
            .then(function (data) {
              return record;
            })
            .catch(function (error) {
              console.log(JSON.stringify(error));
            });
      };

      Database.prototype.remove = function (record) {
        return $utils.to$q(this.type.destroySingle({ Id: record._id }))
            .then(function (result) {
            })
            .catch(function (error) {
              console.log(JSON.stringify(error));
            });
      };

      Database.prototype.clean = function (record) {
        return $utils.to$q(this.type.destroy())
            .then(function (result) {
            })
            .catch(function (error) {
              console.log(JSON.stringify(error));
            });
      };

      return Database;

    });

