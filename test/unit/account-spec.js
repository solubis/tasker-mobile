describe('Store', function () {
  var $scope,
      $q,
      db,
      $account,
      $window,
      email = Math.floor((Math.random() * 10000) + 1) + 'stefan@solubis.pl',
      password = '12345678';

  beforeEach(module('app.everlive'));
  beforeEach(inject(function (_$rootScope_, _$account_, _$window_, _$q_, Store) {
    $scope = _$rootScope_;
    db = new Store('test');
    $account = _$account_;
    $window = _$window_;
    $q = _$q_;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 8000;
  }));

  it("should not allow to manage documents before logon", function (done) {
    var retrieved,
        error,
        doc = {
          title: 'bar'
        };

    db.all(doc)
        .then(function (result) {
          retrieved = result;
        })
        .catch(function (e) {
          error = e;
        })
        .finally(function () {
          expect(error).toBeDefined();
          expect(retrieved).toBeUndefined();

          done();
        });
  });

  it("should allow to register new users", function (done) {
    var error;

    $account.signUp(email, password)
        .catch(function (e) {
          error = e;
          console.log(JSON.stringify(error));
        })
        .finally(function () {
          expect(error).toBeUndefined();

          done();
        });
  });

  it("should allow to login", function (done) {
    var retrieved,
        error,
        userStore, user;

    $account.login(email, password)
        .then(function () {
          userStore = $account.getUserFromStore();
          user = $account.getUser();
        })
        .catch(function (e) {
          error = e;
          console.log(JSON.stringify(error));
        })
        .finally(function () {
          expect(error).toBeUndefined();
          expect(user).toBeDefined();
          expect(userStore).toBeDefined();

          expect(userStore.id).toBeDefined();
          expect(userStore.name).toBeDefined();
          expect(userStore.email).toBeDefined();
          expect(userStore.token).toBeDefined();

          expect(user.id).toBeDefined();
          expect(user.name).toBeDefined();
          expect(user.email).toBeDefined();
          expect(user.token).toBeDefined();

          expect(user.id).toEqual(userStore.id);
          expect(user.name).toEqual(userStore.name);
          expect(user.email).toEqual(userStore.email);
          expect(user.token).toEqual(userStore.token);

          done();
        });
  });

  it("should allow to remove current account", function (done) {
    var error;

    $account.login(email, password)
        .then(function () {
          return $account.remove();
        })
        .catch(function (e) {
          error = e;
          console.log(JSON.stringify(error));
        })
        .finally(function () {
          expect(error).toBeUndefined();
          expect($account.getUserFromStore().id).toBeUndefined();

          done();
        });
  });

  xit("promise test", function (done) {
    function getpromise() {
      var deferred = $q.defer();

      deferred.resolve(1);

      return deferred.promise;
    }

    getpromise()
        .then(function () {
          var kaka;
          kaka.id = 2;
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function(){
          done();
        });

    $scope.$digest();

  })


});
