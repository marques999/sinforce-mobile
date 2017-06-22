function quotesResource($resource, ApiConfiguration) {
  return $resource(ApiConfiguration.endpoint + '/api/quotes/:id', {}, {
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
      save: {
        method: 'Post',
        isArray: false
      }      
  });
}

angular.module('sinforce.quotes').factory('Quotes', quotesResource);