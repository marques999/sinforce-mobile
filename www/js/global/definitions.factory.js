function definitionService(Definitions, ErrorHandler, $q) {

  var events = null;
  var titles = null;
  var leadTypes = null;
  var campanhas = null;
  
  function genTypeMap(toMap) {
    var typesmap = {};
    toMap.forEach(function(type) {
      typesmap[type.id] = type.name;
    });
    return typesmap;
  }

  function loadType(type2get, $q) {
    return function () {
      var d = $q.defer();
      if (this[type2get] && angular.isArray(this[type2get])) {
        d.resolve(this[type2get]);
      } else {
        var result = Definitions.query({
          type2get: type2get
        }, function() {
          d.resolve(this[type2get] = result);
        });
      }
      return d.promise;
    };
  }

function getLeadTypes(userCallback) {
    if (leadTypes!==null) {
      userCallback(leadTypes);
    } else {
      Definitions.query({
          type2get: 'tipoterceirosLead'
      }).$promise.then(function(queryResult) {
        leadTypes = genTypeMap(queryResult);
        if (userCallback) {
          userCallback(leadTypes);
        }
      }).catch(ErrorHandler.$httpTimeout);
    }
  }


  function findReference(array, property, entityId) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][property] == entityId) {
        return array[i];
      }
    }
    return array[0];
  }

  function findEvent(eventId) {
    if (angular.isDefined(eventId) && angular.isString(eventId)) {
      return findReference(events, 'type', eventId);
    } else {
      return events[0];
    }
  }

  function findTitle(titleId) {
    if (angular.isDefined(titleId) && angular.isString(titleId)) {
      return findReference(titles, 'id', titleId);
    } else {
      return titles[0];
    }
  }

  function getEvents(userCallback) {
    if (angular.isArray(events)) {
      userCallback(events);
    } else {
      Definitions.query({
        type2get: 'eventos'
      }).$promise.then(function(queryResult) {
        events = [{
          id: null,
          name: 'Nenhum'
        }];
        events = events.concat(queryResult);
        if (userCallback) {
          userCallback(events);
        }
      }).catch(ErrorHandler.$httpTimeout);
    }
  }

  function getTitles(userCallback) {
    if (angular.isArray(titles)) {
      userCallback(titles);
    } else {
      Definitions.query({
        type2get: 'titulos'
      }).$promise.then(function(queryResult) {
        titles = [{
          id: null,
          name: 'Nenhum'
        }];
        titles = titles.concat(queryResult);
        if (userCallback) {
          userCallback(titles);
        }
      }).catch(ErrorHandler.$httpTimeout);
    }
  }

  function getCampaigns(userCallback) {
    if (angular.isArray(campanhas)) {
      userCallback(campanhas);
    } else {
      Definitions.query({
        type2get: 'campanhas'
      }).$promise.then(function(queryResult) {
        campanhas = [{
          id: null,
          name: 'Nenhum'
        }];
        campanhas = campanhas.concat(queryResult);
        if (userCallback) {
          userCallback(campanhas);
        }
      }).catch(ErrorHandler.$httpTimeout);
    }
  }

  return {
    getLeadTypes: getLeadTypes,
    getEvents: getEvents,
    findEvent: findEvent,
    getTitles: getTitles,
    findTitle: findTitle,
    getCampaigns: getCampaigns,
    thirdPartyTypes4Leads: loadType('tipoterceirosLead', $q),
    countries: loadType('paises', $q),
    idioms: loadType('idiomas', $q),
    zones: loadType('zonas', $q),
    districts: loadType('distritos', $q)
  };
}

angular.module('sinforce').service('DefinitionService', definitionService);