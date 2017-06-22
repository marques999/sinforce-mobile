angular.module('sinforce').filter('defaultdate', function ($filter) {
  return function (input) {
    return $filter('date')(input, 'dd/MM/yyyy HH:mm');
  }
}).filter('percentage', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}).filter('fixedLength', function () {
  return function (input, decimals) {
    return (1e4 + '' + input).slice(-decimals);
  };
}).filter('parseInt', function () {
  function getNumber(input) {
    return isNaN(input) ? null : parseInt(input);
  }
  return function (input) {
    var parsedString = getNumber(input);
    if (parsedString <= 0) {
      return null;
    }
    return parsedString;
  };
}).filter('entityType', function (AgendaConstants) {
  return function (input) {
    if (angular.isString(input)) {
      var entityId = input.toUpperCase();
      var entityTypes = AgendaConstants.origens;
      if (angular.isDefined(entityTypes[entityId])) {
        return entityTypes[entityId];
      }
    }
    return input;
  };
}).filter('startFrom', function () {
  return function (input, start) {
    return input ? input.slice(+start) : [];
  };
}).filter('isoCountry', function (listaPaises) {
  return function (input) {
    if (angular.isString(input)) {
      var countryId = input.toUpperCase();
      if (angular.isDefined(listaPaises[countryId])) {
        return listaPaises[countryId];
      }
    }
    return input;
  };
}).filter('group', function () {
  return function (items, groupSize) {
    var groups = [];
    var inner;
    for (var i = 0; i < items.length; i++) {
      if (i % groupSize === 0) {
        inner = [];
        groups.push(inner);
      }
      inner.push(items[i]);
    }
    return groups;
  };
});