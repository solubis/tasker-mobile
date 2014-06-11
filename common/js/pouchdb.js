angular.module('app.pouchdb', [])

    .factory('Database', function ($q) {

      var _db,
          _databaseName;

      var Database = function (databaseName) {
        _databaseName = databaseName;
        _db = new PouchDB(_databaseName, {adapter: 'websql'});
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
        return $q.when(PouchDB.destroy(_databaseName))
            .then(function () {
              _db = new PouchDB(_databaseName, {adapter: 'websql'});
            })
      };

      Database.prototype.all = function () {
        var me = this;

        var options = {
          include_docs: true
        };

        return $q.when(_db.allDocs(options))
            .then(function (result) {
              var converted;

              converted = result.rows.map(function (element) {
                return me.convert(element.doc);
              });

              return converted;
            });
      };

      Database.prototype.get = function (obj) {
        var me = this;
        var _id = (typeof obj === 'object' ? obj.id : obj);

        return $q.when(_db.get(_id))
            .then(function (record) {
              return me.convert(record);
            });
      };

      Database.prototype.create = function (record) {
        var me = this;

        return $q.when(_db.post(record))
            .then(function (result) {
              return me.get(result.id);
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