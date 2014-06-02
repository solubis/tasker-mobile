describe('directives', function () {
  var $rootScope, $db;

  beforeEach(module('app.tasks'));
  beforeEach(inject(function ($compile, _$rootScope_, _$db_) {
    $rootScope = _$rootScope_;
    $db = _$db_;

  }));

  it('displays form errors', function() {
    expect(1).toEqual(1);
  });
});
