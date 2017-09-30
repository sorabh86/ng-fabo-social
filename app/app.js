'use strict';

// Declare app level module which depends on views, and components
angular.module('fbApp', [
  'ngRoute',
  'fbApp.facebook',
]).

config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/facebook'});
}]);
