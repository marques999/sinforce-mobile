function opportunitiesRoute($stateProvider) {

  $stateProvider.state('app.opportunities', {
    url: '/opportunities',
    abstract: true,
    resolve: {
      opportunities: function(Opportunities) {
        return Opportunities.query().$promise;
      }
    },
    views: {
      'menuContent': {
        controller: 'OpportunitiesController',
        templateUrl: 'templates/opportunities.html'
      }
    }
  }).state('app.opportunities.dashboard', {
    url: '/',
    views: {
      'opportunities-dashboard': {
        templateUrl: 'templates/opportunities/dashboard.html'
      }
    }
  }).state('app.opportunities.list', {
    url: '/list',
    views: {
      'opportunities-list': {
        controller: function($scope) {
          $scope.opportunitySearch = {};
        },
        templateUrl: 'templates/opportunities/list.html'
      }
    }
  }).state('app.opportunities.history', {
    url: '/history',
    views: {
      'opportunities-history': {
        controller: function($scope) {
          $scope.opportunitySearch = {};
        },
        templateUrl: 'templates/opportunities/history.html'
      }
    }
  }).state('app.opportunities-register', {
    url: '/opportunities/new',
    views: {
      'menuContent': {
        templateUrl: 'templates/opportunities/form.html',
        controller: 'RegisterOpportunity'
      }
    }
  }).state('app.opportunities-view', {
    url: '/opportunities/view/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/opportunities/form.html',
        controller: 'ViewOpportunity'
      }
    }
  }).state('app.opportunities-update', {
    url: '/opportunities/update/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/opportunities/form.html',
        controller: 'UpdateOpportunity'
      }
    }
  }).state('app.proposals-view', {
    url: '/proposals/view/:id/:propNumber',
    views: {
      'menuContent': {
        templateUrl: 'templates/opportunities/proposals/form.html',
        controller: 'ViewProposal'
      }
    },
    resolve: {
      proposals: function(Proposals, $stateParams){
        return Proposals.get({
          id: $stateParams.id,
          propNumber: $stateParams.propNumber
        }).$promise;
      }
    }
  }).state('app.proposals-register', {
    url: '/proposals/register/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/opportunities/proposals/form.html',
        controller: 'RegisterProposal'
      }
    }
  }).state('app.proposalsline-register', {
    url: '/proposals/line/register/:id/:propNumber',
    views: {
      'menuContent': {
        templateUrl: 'templates/opportunities/proposals/lineform.html',
        controller: 'RegisterProposalLine'
      }
    }
  }).state('app.proposalsline-view', {
    url: '/proposals/line/view/:id/:propNumber/:line',
    views: {
      'menuContent': {
        templateUrl: 'templates/opportunities/proposals/lineform.html',
        controller: 'ViewProposalLine'
      }
    }
  });
}

angular.module('sinforce.opportunities', ['chart.js']).config(opportunitiesRoute);