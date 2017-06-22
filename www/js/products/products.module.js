function productsRoute($stateProvider) {

  $stateProvider.state('app.products', {
    url: '/products',
    abstract: true,
    views: {
      'menuContent': {
        controller: 'ProductsController',
        templateUrl: 'templates/products.html'
      }
    }
  }).state('app.products.list', {
    url: '/',
    views: {
      'products-list': {
        templateUrl: 'templates/products/list.html'
      }
    }
  }).state('app.products.categories', {
    url: '/categories',
    views: {
      'products-categories': {
        controller: 'CategoriesController',
        templateUrl: 'templates/categories/list.html'
      }
    }
  }).state('app.products.categories-info', {
    url: '/categories/:id',
    resolve: {
      categoryInformation: function(Categories, $stateParams) {
        return Categories.get({
          token: 'XYZ',
          id: $stateParams.id
        }).$promise;
      }
    },
    views: {
      'products-categories': {
        controller: 'CategoriesView',
        templateUrl: 'templates/categories/view.html'
      }
    },
  }).state('app.products.warehouses', {
    url: '/warehouses',
    views: {
      'products-warehouses': {
        controller: 'WarehousesController',
        templateUrl: 'templates/warehouses/list.html'
      }
    }
  });
}

angular.module('sinforce.products', ['base64']).config(productsRoute);