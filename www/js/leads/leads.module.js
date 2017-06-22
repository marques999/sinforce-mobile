function leadsRoute($stateProvider) {

  $stateProvider.state('app.leads', {
    url: '/leads',
    abstract: true,
    views: {
      'menuContent': {
        controller: 'LeadsList',
        templateUrl: 'templates/leads.html'
      }
    }
  }).state('app.leads.dashboard', {
    url: '/dashboard',
    views: {
      'leads-dashboard': {
        templateUrl: 'templates/leads/dashboard.html'
      }
    }
  }).state('app.leads.list', {
    url: '/list',
    views: {
      'leads-list': {
        templateUrl: 'templates/leads/list.html'
      }
    }
  }).state('app.leads.closed', {
    url: '/closed',
    views: {
      'leads-closed': {
        templateUrl: 'templates/leads/closed.html'
      }
    }
  }).state('app.leads-update', {
    url: '/leads/update/:id',
    views: {
      'menuContent': {
        controller: 'LeadsController',
        templateUrl: 'templates/leads/form.html'
      }
    }
  }).state('app.leads-create', {
    url: '/leads/create',
    views: {
      'menuContent': {
        controller: 'LeadsController',
        templateUrl: 'templates/leads/form.html'
      }
    }
  }).state('app.leads-view', {
    url: '/leads/:id',
    params: {
      token: null
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/leads/view.html',
        controller: 'LeadsView'
      }
    }
  });
}

angular.module('sinforce.leads', ['base64','chart.js']).config(leadsRoute);