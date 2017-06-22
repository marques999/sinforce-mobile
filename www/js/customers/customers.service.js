function customersResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/customers/:id', {}, {
    query: {
      method: 'GET',
      isArray: true
    },
    get: {
      method: 'GET',
      isArray: false
    },
    update: {
      method: 'PUT',
      isArray: false
    },
    delete: {
      method: 'DELETE',
      isArray: false
    }
  });
}

angular.module('sinforce.customers').factory('Customers', customersResource);