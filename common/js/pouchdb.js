angular.module('app.pouchdb', [])

    .factory('Database', function ($q) {

      var _db,
          _databaseName;

      var Database = function (databaseName) {
        _databaseName = databaseName;
        _db = new PouchDB(_databaseName, {adapter: 'websql'});
      };

      function convert(record) {
        for (var field in record) {
          if (record.hasOwnProperty(field) && field.indexOf('date') >= 0) {
            record.date = new Date(record.date);
          }
        }

        return record;
      }

      Database.prototype.clean = function () {
        return $q.when(PouchDB.destroy(_databaseName))
            .then(function () {
              _db = new PouchDB(_databaseName, {adapter: 'websql'});
            })
      };

      Database.prototype.all = function () {
        var options = {
          include_docs: true
        };

        return $q.when(_db.allDocs(options))
            .then(function (result) {
              var converted;

              converted = result.rows.map(function (element) {
                return convert(element.doc);
              });

              return converted;
            });
      };

      Database.prototype.get = function (obj) {
        var _id = (typeof obj === 'object' ? obj.id : obj);

        return $q.when(_db.get(_id))
            .then(function (record) {
              return convert(record);
            });
      };

      Database.prototype.create = function (record) {
        var me = this;

        return $q.when(_db.post(record))
            .then(function (result) {
              me.get(result.id);
            });
      };

      Database.prototype.update = function (record) {
        return $q.when(_db.put(record))
            .then(function (result) {
              record._rev = result.rev;
            });
      };

      Database.prototype.remove = function (record) {
        return $q.when(_db.remove(record));
      };

      return Database;
    });