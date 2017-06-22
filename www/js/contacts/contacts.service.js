function contactsResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/contacts/:id', {}, {
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

angular.module('sinforce.contacts').factory('Contacts', contactsResource);