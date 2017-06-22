function warehousesResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/warehouses/:id', {}, {
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

angular.module('sinforce.products').factory('Warehouses', warehousesResource);