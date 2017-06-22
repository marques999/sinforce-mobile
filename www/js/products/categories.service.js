function categoriesResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/categories/:id', {}, {
    query: {
      method: 'GET',
      isArray: true
    },
    get: {
      method: 'GET',
      isArray: false
    },
  });
}

angular.module('sinforce.products').factory('Categories', categoriesResource);