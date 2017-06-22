function proposalsResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/proposals/:id/:propNumber', {
    id: '@id',
    propNumber: '@propNumber'
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

angular.module('sinforce.opportunities').factory('Proposals', proposalsResource);

function proposalsLineResource($resource, ApiConfiguration) {

  return $resource(ApiConfiguration.endpoint + '/api/ProposalLine/:id/:propNumber/:line', {
    id: '@id',
    propNumber: '@propNumber',
    line: '@id'
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

angular.module('sinforce.opportunities').factory('ProposalsLine', proposalsLineResource);