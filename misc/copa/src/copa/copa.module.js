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
  angular.module('copa.directives', []);
  angular.module('copa.filters', []);
  angular.module('copa.services', []);
  angular.module('copa',
    [
      'copa.config',
      'copa.directives',
      'copa.filters',
      'copa.services',
      'ngResource',
      'ngCookies',
      'ngSanitize'
    ]);

})(angular);
