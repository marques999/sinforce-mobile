function usersRoute($stateProvider) {

  $stateProvider.state('app.users-profile', {
    url: '/profile/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/users/profile.html'
      }
    }
  }).state('app.users-register', {
    url: '/users/new',
    params: {
      update: false
    },
    views: {
      'menuContent': {
        controller: 'UserController',
        templateUrl: 'templates/users/form.html'
      }
    }
  }).state('app.users-update', {
    url: '/users/update',
    params: {
      update: true
    },
    views: {
      'menuContent': {
        controller: 'UserController',
        templateUrl: 'templates/users/form.html'
      }
    }
  });
}

angular.module('sinforce.users', ['ngPassword']).config(usersRoute);