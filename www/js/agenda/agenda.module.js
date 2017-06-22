function agendaRoute($stateProvider) {

  $stateProvider.state('app.agenda', {
    url: '/agenda',
    abstract: true,
    views: {
      'menuContent': {
        controller: 'AgendaList',
        templateUrl: 'templates/agenda.html'
      }
    }
  }).state('app.agenda.calendar', {
    url: '/',
    views: {
      'agenda-calendar': {
        templateUrl: 'templates/agenda/dashboard.html'
      }
    }
  }).state('app.agenda.list', {
    url: '/events',
    views: {
      'agenda-list': {
        controller: function($scope) {
          $scope.activitySearch = {};
        },
        templateUrl: 'templates/agenda/list.html'
      }
    }
  }).state('app.agenda.history', {
    url: '/history',
    views: {
      'agenda-history': {
        controller: function($scope) {
          $scope.activitySearch = {};
        },
        templateUrl: 'templates/agenda/history.html'
      }
    }
  }).state('app.agenda-register', {
    url: '/agenda/new',
    resolve: {
      activityInformation: function() {
        return null;
      }
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/agenda/form.html',
        controller: 'AgendaController'
      }
    }
  }).state('app.agenda-view', {
    url: '/agenda/view/:id',
    params: {
      token: null
    },
    resolve: {
      activityInformation: ['$stateParams', 'Agenda',
        function($stateParams, Agenda) {
          return Agenda.get({
            id: $stateParams.id,
            token: $stateParams.token
          }).$promise;
        }
      ]
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/agenda/view.html',
        controller: 'AgendaView'
      }
    }
  }).state('app.agenda-update', {
    url: '/agenda/update/:id',
    params: {
      token: null,
      profile: false
    },
    resolve: {
      activityInformation: ['$stateParams', 'Agenda',
        function($stateParams, Agenda) {
          return Agenda.get({
            id: $stateParams.id,
            token: $stateParams.token
          }).$promise;
        }
      ]
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/agenda/form.html',
        controller: 'AgendaController'
      }
    }
  });
}

angular.module('sinforce.agenda', ['ui.rCalendar', 'ion-datetime-picker']).config(agendaRoute);