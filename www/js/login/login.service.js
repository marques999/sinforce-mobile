function loginResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/login/:id', {}, {
    login: {
      method: 'POST',
      isArray: false
    },
    logout: {
      method: 'DELETE',
      isArray: false,
    }
  });
}

angular.module('sinforce.login').factory('Auth', loginResource);