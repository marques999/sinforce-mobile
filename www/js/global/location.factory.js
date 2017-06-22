function locationService(Definitions, ErrorHandler, Location) {

  var paises = null;
  var concelhos = null;
  var distritos = null;
  var lastDistritoId = -1;

  function findReference(array, property, entityId) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][property] == entityId) {
        return array[i];
      }
    }
    return array[0];
  }

  function findConcelhos(concelhoId) {
    if (angular.isDefined(concelhoId) && concelhoId !== null) {
      return findReference(concelhos, 'name', concelhoId);
    } else {
      return concelhos[0];
    }
  }

  function findDistritos(distritoId) {
    if (angular.isDefined(distritoId) && distritoId !== null) {
      return findReference(distritos, 'name', distritoId);
    } else {
      return distritos[0];
    }
  }

  function findPaises(countryId) {
    if (angular.isDefined(countryId) && countryId !== null) {
      return findReference(paises, 'id', countryId);
    } else {
      return paises[0];
    }
  }

  function getConcelhos(distritoId, userCallback, userToken) {
    if (lastDistritoId == distritoId) {
      userCallback(concelhos);
    } else {
      if (distritoId === null) {
        concelhos = [{
          id: null,
          name: 'Nenhum'
        }];
        userCallback(concelhos);
      } else {
        Location.get({
          id: distritoId,
          token: userToken
        }).$promise.then(function(queryResult) {
          concelhos = queryResult;
          userCallback(concelhos);
        }).catch(ErrorHandler.$httpTimeout);
      }
    }
  }

  function getDistritos(userCallback, userToken) {
    if (angular.isArray(distritos)) {
      userCallback(distritos);
    } else {
      Location.query({
        token: userToken
      }).$promise.then(function(queryResult) {
        distritos = [{
          id: null,
          name: 'Nenhum'
        }];
        distritos = distritos.concat(queryResult);
        userCallback(distritos);
      }).catch(ErrorHandler.$httpTimeout);
    }
  }

  function getPaises(userCallback, userToken) {
    if (angular.isArray(paises)) {
      userCallback(paises);
    } else {
      Definitions.query({
        token: userToken,
        type2get: 'paises'
      }).$promise.then(function(queryResult) {
        paises = [{
          id: null,
          name: 'Nenhum'
        }];
        paises = paises.concat(queryResult);
        userCallback(paises);
      }).catch(ErrorHandler.$httpTimeout);
    }
  }

  return {
    getPaises: getPaises,
    findPaises: findPaises,
    getConcelhos: getConcelhos,
    findConcelhos: findConcelhos,
    getDistritos: getDistritos,
    findDistritos: findDistritos
  };
}

angular.module('sinforce.global').factory('LocationService', locationService);