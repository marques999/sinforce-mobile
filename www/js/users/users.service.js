function usersResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/users/:id', {}, {
    query: {
      method: 'GET',
      isArray: true
    },
    get: {
      method: 'GET',
      isArray: false
    },
    save: {
      method: 'POST',
      isArray: false
    }
  });
}

angular.module('sinforce.users').factory('Users', usersResource);