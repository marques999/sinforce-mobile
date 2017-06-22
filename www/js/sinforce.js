angular.module('sinforce', [
  'ionic',
  'ngCordova',
  'ngResource',
  'angular.filter',
  'sinforce.constants',
  'sinforce.global',
  'sinforce.login',
  'sinforce.users',
  'sinforce.agenda',
  'sinforce.contacts',
  'sinforce.customers',
  'sinforce.leads',
  'sinforce.opportunities',
  'sinforce.products',
  'sinforce.quotes'
]).run(function($rootScope, $state, $http, $stateParams, $ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString('#447889');
    }
  });
}).config(function($stateProvider, $httpProvider, $urlRouterProvider, $ionicConfigProvider, ChartJsProvider) {
  $ionicConfigProvider.backButton.text('');
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.navBar.alignTitle('left');
  $ionicConfigProvider.tabs.position('top');
  $ionicConfigProvider.views.transition('platform');
  ChartJsProvider.setOptions({
    responsive: true
  });
  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'LoginCtrl'
  });
  $urlRouterProvider.otherwise('/app/login');
});