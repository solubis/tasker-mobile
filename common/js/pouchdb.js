angular.module('app.pouchdb', [])

    .factory('$utils', function ($q, $rootScope) {
      return {
        to$q: function (promise) {
          var deferred = $q.defer();

          promise.then(function (result) {
            deferred.resolve(result);
            $rootScope.$digest();
          });

          promise.catch(function (error) {
            deferred.reject(error);
            $rootScope.$digest();
          });

          return deferred.promise;
        }
      }
    })

    .factory('Database', function ($utils) {

      var _db,
          _databaseName;


      function init() {
        _db = new PouchDB(_databaseName, {adapter: 'websql'});
      }

      var Database = function (databaseName) {
        _databaseName = databaseName;
        init();
      };

      Database.prototype.convert = function (record) {
        for (var field in record) {
          if (record.hasOwnProperty(field)
              && field.toLowerCase().indexOf('date') >= 0
              && typeof record[field] === 'string') {
            record[field] = new Date(record[field]);
          }
        }

        return record;
      };

      Database.prototype.clean = function () {
        return $utils.to$q(PouchDB.destroy(_databaseName))
            .then(function () {
              return init();
            });
      };

      Database.prototype.all = function () {
        var me = this;

        var options = {
          include_docs: true
        };

        return $utils.to$q(_db.allDocs(options))
            .then(function (result) {
              var converted;

              converted = result.rows.map(function (element) {
                return me.convert(element.doc);
              });

              return converted;
            });
      };

      Database.prototype.get = function (obj) {
        var me = this,
            _id = (typeof obj === 'object' ? obj._id : obj);

        return $utils.to$q(_db.get(_id))
            .then(function (record) {
              return me.convert(record);
            });
      };


      Database.prototype.create = function (record) {
        var me = this;

        return $utils.to$q(_db.post(record))
            .then(function (result) {
              return me.get(result.id);
            });
      };


      Database.prototype.update = function (record) {
        return $utils.to$q(_db.put(record))
            .then(function (result) {
              record._rev = result.rev;
              return record;
            });
      };

      Database.prototype.remove = function (record) {
        return $utils.to$q(_db.remove(record));
      };

      return Database;
    });