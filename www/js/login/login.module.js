function loginRoute($stateProvider) {

  $stateProvider.state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/users/login.html'
      }
    }
  });
}

angular.module('sinforce.login', ['ngMessages']).config(loginRoute);