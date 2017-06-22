function entityFactory(Contacts, Customers, ErrorHandler, Leads) {

  var leads = null;
  var contacts = null;
  var customers = null;
  var representatives = null;

  function findReference(array, entityId) {
    if (angular.isDefined(entityId) && angular.isString(entityId)) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].id == entityId) {
          return array[i];
        }
      }
    }
    return array[0];
  }

  function getContacts(forceRefresh, userCallback, userToken) {
    if (!forceRefresh && angular.isArray(contacts)) {
      userCallback(contacts);
    } else {
      Contacts.query({
        token: userToken
      }).$promise.then(function (userQuery) {
        contacts = userQuery;
        if (userCallback) {
          userCallback(userQuery);
        }
      }).catch(ErrorHandler.$httpTimeout);
    }
  }

  function getCustomers(forceRefresh, userCallback, userToken) {
    if (!forceRefresh && angular.isArray(customers)) {
      userCallback(customers);
    } else {
      Customers.query({
        token: userToken
      }).$promise.then(function (userQuery) {
        customers = userQuery;
        if (userCallback) {
          userCallback(userQuery);
        }
      }).catch(ErrorHandler.$httpTimeout);
    }
  }

  function getLeads(forceRefresh, userCallback, userToken) {
    if (!forceRefresh && angular.isArray(leads)) {
      userCallback(leads);
    } else {
      Leads.query({
        token: userToken
      }).$promise.then(function (userQuery) {
        leads = userQuery;
        if (userCallback) {
          userCallback(userQuery);
        }
      }).catch(ErrorHandler.$httpTimeout);
    }
  }

  var dummyEntity = {
    id: null,
    type: 'N',
    name: 'Nenhum'
  };

  function findRepresentative(representativeId) {
    return findReference(representatives, representativeId);
  }

  function findEntity(entityId, sourceId) {
    switch (sourceId) {
    case 'C':
      return findReference(customers, entityId);
    case 'L':
      return findReference(leads, entityId);
    case 'X':
      return findReference(contacts, entityId);
    default:
      return dummyEntity;
    }
  }

  function getEntities(sourceId, userCallback, userToken) {
    switch (sourceId) {
    case 'C':
      getCustomers(false, userCallback, userToken);
      break;
    case 'L':
      getLeads(false, userCallback, userToken);
      break;
    case 'X':
      getContacts(false, userCallback, userToken);
      break;
    default:
      userCallback([dummyEntity]);
      break;
    }
  }

  return {
    getLeads: getLeads,
    findEntity: findEntity,
    getContacts: getContacts,
    getEntities: getEntities,
    getCustomers: getCustomers,
    findRepresentative: findRepresentative
  };
}

angular.module('sinforce').factory('EntityFactory', entityFactory);