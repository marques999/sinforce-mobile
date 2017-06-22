function locationResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/location/:id', {}, {
    query: {
      method: 'GET',
      isArray: true
    },
    get: {
      method: 'GET',
      isArray: true
    }
  });
}

angular.module('sinforce.global', []).factory('Location', locationResource);