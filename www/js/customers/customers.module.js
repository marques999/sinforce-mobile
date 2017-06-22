function customersRoute($stateProvider) {

  $stateProvider.state('app.customers', {
    url: '/customers',
    abstract: true,
    views: {
      'menuContent': {
        controller: 'CustomersList',
        templateUrl: 'templates/customers.html'
      }
    }
  }).state('app.customers.dashboard', {
    url: '/',
    views: {
      'customers-dashboard': {
        templateUrl: 'templates/customers/dashboard.html'
      }
    }
  }).state('app.customers.list', {
    url: '/list',
    views: {
      'customers-list': {
        controller: function($scope) {
          $scope.customerSearch = {
            status: 'ACTIVO'
          };
        },
        templateUrl: 'templates/customers/list.html'
      }
    }
  }).state('app.customers.history', {
    url: '/history',
    views: {
      'customers-history': {
        controller: function($scope) {
          $scope.customerSearch = {
            status: 'INACTIVO'
          };
        },
        templateUrl: 'templates/customers/list.html'
      }
    }
  }).state('app.customers-register', {
    url: '/customers/new',
    resolve: {
      customer: function() {
        return null;
      }
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/customers/form.html',
        controller: 'CustomersController',
      }
    }
  }).state('app.customers-update', {
    url: '/customers/update/:id',
    params: {
      token: null,
      profile: false
    },
    resolve: {
      customer: ['$base64', '$stateParams', 'Customers',
        function($base64, $stateParams, Customers) {
          return Customers.get({
            token: $stateParams.token,
            id: $base64.encode($stateParams.id)
          }).$promise;
        }
      ]
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/customers/form.html',
        controller: 'CustomersController',
      }
    }
  }).state('app.customers-view', {
    url: '/customers/:id',
    params: {
      token: null
    },
    resolve: {
      customer: ['$base64', '$stateParams', 'Customers',
        function($base64, $stateParams, Customers) {
          return Customers.get({
            token: $stateParams.token,
            id: $base64.encode($stateParams.id)
          }).$promise;
        }
      ]
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/customers/view.html',
        controller: 'CustomersView'
      }
    }
  });
}

angular.module('sinforce.customers', ['base64', 'chart.js']).config(customersRoute);