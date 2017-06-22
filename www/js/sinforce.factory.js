angular.module('sinforce').factory('ErrorHandler', function ($ionicPopup) {
  var popupTemplate = {
    okType: 'button-royal',
    cssClass: 'custom-popup',
    title: 'CONNECTION ERROR',
  };

  function customError(message) {
    $ionicPopup.alert({
      title: '<strong>APPLICATION ERROR</strong>',
      okType: 'button-royal',
      cssClass: 'custom-popup',
      template: message
    });
  }

  function httpError(httpResponse) {
    if (httpResponse.status == 400) {
      popupTemplate.title = httpResponse.statusText;
      popupTemplate.template = httpResponse.data;
    } else if (httpResponse.status == 403) {
      popupTemplate.title = 'PERMISSÕES INSUFICIENTES';
      popupTemplate.template = 'Não possui permissões para executar a operação actual. (Request URL: ' + httpResponse.config.url + ')';
    } else if (httpResponse.status == -1) {
      popupTemplate.template = 'O tempo limite da operação foi atingido. Por favor verifique a sua ligação ao servidor.';
    } else {
      popupTemplate.template = 'Não foi possível apresentar esta página. (Request URL: ' + httpResponse.config.url + ')';
    }
    $ionicPopup.alert(popupTemplate);
  }
  return {
    $: customError,
    $httpTimeout: httpError
  };
}).factory('PopupProvider', function ($ionicPopup) {
  return {
    confirmDelete: function() {
      return $ionicPopup.confirm({
        title: 'Apagar entrada',
        okText: 'Sim',
        cancelText: 'Não',
        template: 'Tem a certeza que deseja apagar esta entrada?'
      });
    },
    confirmCancel: function() {
      return $ionicPopup.confirm({
        title: 'Cancelar atividade',
        okText: 'Sim',
        cancelText: 'Não',
        template: 'Tem a certeza que deseja cancelar esta atividade?'
      });
    }
  };
}).factory('MonthChart', function() {
  var months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function getMonth(monthIndex) {
    return months[mod(monthIndex, months.length)];
  }

  function getLength() {
    return months.length - 3;
  }

  function getFirst() {
    return new Date().getMonth() - getLength();
  }

  function filterByDate(firstMonth) {
    return function (entity) {
      var dateModified = new Date(entity.dateModified).getTime();
      return dateModified > new Date().setMonth(firstMonth) && dateModified < new Date().setMonth(firstMonth + 1);
    };
  }

  return {
    filterByDate: filterByDate,
    getLength: getLength,
    getMonth: getMonth,
    getFirst: getFirst
  }
}).factory('ModalProvider', function ($ionicLoading, $ionicModal) {
  return {
    activityModal: {
      name: 'activityModal',
      templateUrl: 'templates/agenda/view.html'
    },
    concelhosModal: {
      name: 'concelhosModal',
      templateUrl: 'templates/modal/concelho.html'
    },
    customerModal: {
      name: 'customerModal',
      templateUrl: 'templates/modal/customer.html'
    },
    distritosModal: {
      name: 'distritosModal',
      templateUrl: 'templates/modal/distrito.html'
    },
    zonasModal: {
      name: 'zonasModal',
      templateUrl: 'templates/modal/zone.html'
    },
    sellscycleModal:{
      name: 'sellscycleModal',
      templateUrl: 'templates/modal/sellscycle.html'
    },
    originModal: {
      name: 'originModal',
      templateUrl: 'templates/modal/origin.html'
    },
    clientsModal: {
      name: 'clientsModal',
      templateUrl: 'templates/modal/clients.html'
    },
    campaignModal: {
      name: 'campaignModal',
      templateUrl: 'templates/modal/campaigns.html'
    },
    entityModal: {
      name: 'entityModal',
      templateUrl: 'templates/modal/entity.html'
    },
    entitiesModal: {
      name: 'entitiesModal',
      templateUrl: 'templates/modal/entities.html'
    },
    statesModal: {
      name: 'statesModal',
      templateUrl: 'templates/modal/states.html'
    },
    eventModal: {
      name: 'eventModal',
      templateUrl: 'templates/modal/event.html',
    },
    opportunityModal: {
      name: 'opportunityModal',
      templateUrl: 'templates/opportunities/view.html',
    },
    paymentMethodModal: {
      name: 'paymentMethodModal',
      templateUrl: 'templates/modal/paymentMethodModal.html'
    },
    paymentConditionModal: {
      name: 'paymentConditionModal',
      templateUrl: 'templates/modal/paymentConditionModal.html'
    },
    productSelectionModal: {
      name: 'productSelectionModal',
      templateUrl: 'templates/modal/productSelectionModal.html'
    },
    productsModal: {
      name: 'productsModal',
      templateUrl: 'templates/quotes/productsModal.html'
    },
    opportunityStatusModal: {
      name: 'opportunityStatusModal',
      templateUrl: 'templates/modal/opportunityStatusModal.html'
    },
    paisesModal: {
      name: 'paisesModal',
      templateUrl: 'templates/modal/country.html'
    },
    productModal: {
      name: 'productModal',
      templateUrl: 'templates/products/view.html'
    },
    representativeModal: {
      name: 'representativeModal',
      templateUrl: 'templates/modal/representative.html',
    },
    sourceModal: {
      name: 'sourceModal',
      templateUrl: 'templates/modal/source.html'
    },
    titleModal: {
      name: 'titleModal',
      templateUrl: 'templates/modal/title.html'
    },
    warehouseModal: {
      name: 'warehouseModal',
      templateUrl: 'templates/warehouses/view.html',
    },
    displayLoading: function() {
      $ionicLoading.show({
        template: '<p>Por favor aguarde...</p><ion-spinner></ion-spinner>'
      });
    },
    hideLoading: function() {
      $ionicLoading.hide();
    },
    display: function(scope, config) {
      var modalObject = config.name;
      if (!scope[modalObject]) {
        $ionicModal.fromTemplateUrl(config.templateUrl, {
          scope: scope,
        }).then(function(modalResult) {
          scope[modalObject] = modalResult;
          scope.$on('$destroy', function() {
            if (scope[modalObject]) {
              scope[modalObject].remove();
              scope[modalObject] = null;
            }
          });
          scope[modalObject].show();
        });
      } else if (!scope[modalObject].isShown()) {
        scope[modalObject].show();
      }
    }
  };
}).factory('Definitions', function($resource, ApiConfiguration) {
  return $resource(ApiConfiguration.endpoint + '/api/definitions/:id', {}, {
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
});