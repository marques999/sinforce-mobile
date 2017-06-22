function productsResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/products/:id', {}, {
    query: {
      method: 'GET',
      isArray: true
    },
    get: {
      method: 'GET',
      isArray: false
    }
  });
}

angular.module('sinforce.products').factory('Products', productsResource);