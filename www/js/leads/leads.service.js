function leadsResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/leads/:id/:token', {
    id: '@id',
    token: '@token'
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
    }
  });
}

angular.module('sinforce.leads').factory('Leads', leadsResource);