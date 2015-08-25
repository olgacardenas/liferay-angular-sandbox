describe('Controller for all site', function() {
  var $controller;
  var $scope, controller;

  beforeEach(module('copa.controllers'));

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
  }));

  beforeEach(function () {
    $scope = {};
    controller = $controller('TestAllSiteController', {$scope: $scope});
  });

  it("testing", function () {
    expect($scope.myValue.length).toBeGreaterThan(0);
  });
});
