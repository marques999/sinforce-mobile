function opportunitiesResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/opportunities/:id', {
    id: '@id'
  }, {
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

angular.module('sinforce.opportunities').factory('Opportunities', opportunitiesResource);