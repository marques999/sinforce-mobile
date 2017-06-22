function agendaResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/agenda/:id', {}, {
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

angular.module('sinforce.agenda').factory('Agenda', agendaResource);