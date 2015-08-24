(function (angular) {

  // Create all modules and define dependencies to make sure they exist
  // and are loaded in the correct order to satisfy dependency injection
  // before all nested files are concatenated by Gulp

  // Config
  angular.module('copa.config', [])
    .value('copa.config', {
      debug: true
    });

  // Modules
  angular.module('copa.services', []);
  angular.module('copa.controllers', []);
  angular.module('copa.directives', []);
  angular.module('copa.filters', []);
  angular.module('copa',
    [
      'copa.config',
      'copa.services',
      'copa.controllers',
      'copa.directives',
      'copa.filters',
      'ngResource',
      'ngCookies',
      'ngSanitize'
    ]);

})(angular);

angular.module('copa.controllers')
  .controller('TestController', ['$scope', function ($scope) {
    $scope.myValue = 'some text';
  }]);
