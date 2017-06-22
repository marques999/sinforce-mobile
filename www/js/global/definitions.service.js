function definitionsResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/definitions', {}, {
    query: {
      method: 'GET',
      isArray: true
    }
  });
}

angular.module('sinforce.leads', []).factory('Definitions', definitionsResource);