function quotesRoute($stateProvider) {

  $stateProvider.state('app.quotes', {
    url: '/quotes',
    abstract: true,
    views: {
      'menuContent': {
        templateUrl: 'templates/quotes.html'
      }
    }
  }).state('app.quotes.list', {
    url: '/',
    views: {
      'quotesContent': {
        controller: 'QuotesCtrl',
        templateUrl: 'templates/quotes/list.html'
      }
    }
  }).state('app.quotes-view', {
    url: '/quotes/view/:id',
    params: {
      token: null
    },
    resolve: {
      quote: ['$stateParams', 'Quotes',
        function ($stateParams, Quotes) {
          return Quotes.get({
            token: $stateParams.token,
            id: $stateParams.id
          }).$promise;
        }
      ]
    },
    views: {
      'menuContent': {
        controller: 'QuotesView',
        templateUrl: 'templates/quotes/view.html'
      }
    }
  }).state('app.quotes.register', {
    url: '/create',
    cache: false,
    views: {
      'quotesContent': {
        controller: 'RegisterQuote',
        templateUrl: 'templates/quotes/create.html'
      }
    }
  }).state('app.quotes.update', {
    url: '/update',
    resolve: {
      quote: ['$stateParams', 'Quotes',
        function ($stateParams, Quotes) {
          return Quotes.get({
            id: $stateParams.id
          }).$promise;
        }
      ]
    },
    views: {
      'quotesContent': {
        templateUrl: 'templates/quotes/form.html',
        controller: 'UpdateQuote'
      }
    }
  });
}

angular.module('sinforce.quotes', ['chart.js', 'ui.router'])
  .config(quotesRoute);