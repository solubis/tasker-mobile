describe('PouchDB', function () {
  var $scope, $db, $q, $rootScope;

  beforeEach(module('app.everlive'));
  beforeEach(inject(function ($compile, _$rootScope_, _$q_, Database) {
    $rootScope = _$rootScope_;
    $db = new Database('test');
    $q = _$q_;
  }));

  beforeEach(function (done) {
    $db.clean().then(done);
  });

  it("should clean database", function (done) {
    var error;

    $db.clean()
        .catch(function (e) {
          error = e;
        })
        .finally(function () {
          expect(error).toBeUndefined();

          done();
        });
  });


  it("should allow you to store documents", function (done) {
    var retrieved,
        error,
        doc = {
          title: 'bar'
        };

    $db.create(doc)
        .then(function (result) {
          retrieved = result;
        })
        .catch(function (e) {
          error = e;
        })
        .finally(function () {

          expect(error).toBeUndefined();
          expect(retrieved).not.toBeNull();
          expect(retrieved._id).toBeDefined();
          expect(retrieved.title).toBe('bar');

          done();
        });

  });


  it("should allow you to retrieve documents", function (done) {
    var retrieved,
        error,
        doc = {
          title: 'bar'
        };

    $db.create(doc)
        .then(function () {
          return $db.create({title:'foo'})
        })
        .then(function () {
          return $db.all();
        })
        .then(function (result) {
          retrieved = result;
        })
        .catch(function (e) {
          error = e;
        })
        .finally(function () {

          expect(error).toBeUndefined();
          expect(retrieved).not.toBeNull();
          expect(retrieved).toBeDefined();
          expect(retrieved.length).toBe(2);
          expect(retrieved[0].title).toBe('bar');

          done();
        });

  });

  it("should allow you to get documents", function (done) {
    var retrieved,
        error,
        doc = {
          title: 'bar'
        };

    $db.create(doc)
        .then(function (result) {
          return $db.get(result);
        })
        .then(function(result){
          retrieved = result;
        })
        .catch(function (e) {
          error = e;
        })
        .finally(function () {

          expect(error).toBeUndefined();
          expect(retrieved).not.toBeNull();
          expect(retrieved).toBeDefined();
          expect(retrieved.title).toBe('bar');

          done();
        });

  });

  it("should allow you to update documents", function (done) {
    var retrieved,
        error,
        doc = {
          title: 'bar'
        };

    $db.create(doc)
        .then(function (result) {
          result.title = 'foo';
          return $db.update(result);
        })
        .then(function (result) {
          return $db.get(result._id);
        })
        .then(function(result){
          retrieved = result;
        })
        .catch(function (e) {
          error = e;
        })
        .finally(function () {

          expect(error).toBeUndefined();
          expect(retrieved).not.toBeNull();
          expect(retrieved).toBeDefined();
          expect(retrieved.title).toBe('foo');

          done();
        });

  });

  it("should allow you to remove documents", function (done) {
    var retrieved,
        error,
        doc = {
          title: 'bar'
        },
        created;

    $db.create(doc)
        .then(function (result) {
          created = result;
          return $db.remove(result);
        })
        .catch(function (e) {
          error = e;
        })
        .finally(function () {

          expect(error).toBeUndefined();

          done();
        });

  });

});
