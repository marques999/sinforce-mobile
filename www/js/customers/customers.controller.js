function customersList(
  $base64,
  $scope,
  $state,
  $rootScope,
  Customers,
  MonthChart,
  ErrorHandler,
  ModalProvider,
  PopupProvider,
  ContactIntegration) {

  $scope.pieChartDefaultOptions = {
    legend: {
      position: 'bottom',
      display: true
    }
  };

  $scope.series = [
    'Novos clientes',
  ];

  $scope.labels2 = [
    'Activo',
    'Inactivo'
  ];

  var timelineDescription = [
    'Criado',
    'Modificado',
    'Removido'
  ];

  var timelineColor = [
    'bg-color-green',
    'bg-color-blue',
    'bg-color-red'
  ];

  var timelineIcon = [
    'ion-person-add',
    'ion-compose',
    'ion-close-circled'
  ];

  function getCustomerStatus(customerInformation) {
    if (customerInformation.status == 'INACTIVO') {
      return 2;
    }
    if (customerInformation.dateCreated == customerInformation.dateModified) {
      return 0;
    }
    return 1;
  }

  $scope.getTimelineDescription = function(customerInformation) {
    return timelineDescription[getCustomerStatus(customerInformation)];
  };

  $scope.getTimelineColor = function(customerInformation) {
    return timelineColor[getCustomerStatus(customerInformation)];
  };

  $scope.getTimelineIcon = function(customerInformation) {
    return timelineIcon[getCustomerStatus(customerInformation)];
  };

  $scope.generateCharts = function() {
    $scope.labels1 = [];
    $scope.data2 = [0, 0];
    $scope.customers.forEach(function(customer) {
      return customer.status == 'ACTIVO' ? $scope.data2[0]++ : $scope.data2[1]++;
    });
    var temporaryArray = [];
    var firstMonth = MonthChart.getFirst();
    var numberMonths = MonthChart.getLength();
    for (var i = 0; i < numberMonths; i++) {
      $scope.labels1.push(MonthChart.getMonth(firstMonth + i + 1));
      temporaryArray.push($scope.customers.filter(MonthChart.filterByDate(firstMonth + i)).length);
    }
    $scope.data1 = [temporaryArray];
  };

  $scope.refreshCustomers = function(fromLoading) {
    if (fromLoading) {
      ModalProvider.displayLoading();
    }
    Customers.query({
      token: $scope.getSessionToken()
    }).$promise.then(function(queryResult) {
      $scope.customers = queryResult;
      $scope.generateCharts();
    }).catch(ErrorHandler.$httpTimeout).finally(function() {
      if (fromLoading) {
        ModalProvider.hideLoading();
      } else {
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  };

  $scope.onDelete = function(customerInformation) {
    ContactIntegration.removeContact(customerInformation.name, function(operationResult) {
      if (operationResult) {
        ErrorHandler.js(operationResult);
      }
      $scope.removeFromArray(customerInformation.id);
      $scope.customers.push(customerInformation);
      $state.go('app.customers.list');
    });
  };

  $scope.deleteCustomer = function(customerId) {
    PopupProvider.confirmDelete().then(function(dialogResult) {
      if (dialogResult) {
        Customers.delete({
          id: $base64.encode(customerId),
          token: $scope.getSessionToken()
        }).$promise.then($scope.onDelete).catch(ErrorHandler.$httpTimeout);
      }
    });
  };

  $scope.updateCustomer = function(customerId) {
    $state.go('app.customers-update', {
      id: customerId,
      profile: false,
      token: $scope.getSessionToken()
    });
  };

  $scope.viewCustomer = function(customerId) {
    $state.go('app.customers-view', {
      id: customerId,
      token: $scope.getSessionToken()
    });
  };

  $scope.removeFromArray = function(customerId) {
    for (var i = 0; i < $scope.customers.length; i++) {
      if ($scope.customers[i].id == customerId) {
        $scope.customers.splice(i, 1);
        return;
      }
    }
  };

  $rootScope.$on('customers:create', function(event, customerInformation) {
    $scope.customers.push(customerInformation);
  });

  $rootScope.$on('customers:update', function(event, customerInformation) {
    $scope.removeFromArray(customerInformation.id);
    $scope.customers.push(customerInformation);
  });

  $scope.refreshCustomers(true);
}

function customersController(
  $base64,
  $filter,
  $scope,
  $state,
  $stateParams,
  $ionicHistory,
  customer,
  Customers,
  ErrorHandler,
  LocationService,
  ModalProvider,
  ContactIntegration) {
  $scope.entityModel = {};
  $scope.currencyModel = {};

  var updateCustomer = !!customer;
  var getNumber = $filter('parseInt');
  var fromProfile = $stateParams.profile || false;

  var defaultLocation = {
    parish: null,
    state: null,
    country: 'PT'
  };

  if (!fromProfile) {
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
      viewData.enableBack = true;
    });
  }

  if (updateCustomer) {
    $scope.userModel = customer;
    $scope.formTitle = 'EDITAR CLIENTE';
    $scope.previousName = (' ' + customer.name).slice(1);
    $scope.userModel.taxNumber = getNumber(customer.taxNumber);
    $scope.userModel.mobile = getNumber(customer.mobile);
    $scope.userModel.phone = getNumber(customer.phone);
    $scope.userModel.phone2 = getNumber(customer.phone2);
    $scope.locationModel = customer.location;
  } else {
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
      viewData.enableBack = true;
    });
    $scope.userModel = {};
    $scope.formTitle = 'NOVO CLIENTE';
    $scope.locationModel = defaultLocation;
  }

  $scope.onCreate = function(customerInformation) {
    ContactIntegration.insertContact(customerInformation, function(operationResult) {
      if (operationResult) {
        ErrorHandler.js(operationResult);
      }
      $scope.userModel = {};
      $scope.locationModel = defaultLocation;
      $scope.$emit('customers:create', customerInformation);
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.customers.list');
    });
  };

  $scope.onUpdate = function(customerInformation) {
    ContactIntegration.updateContact($scope.previousName, customerInformation, function(operationResult) {
      if (operationResult) {
        ErrorHandler.js(operationResult);
      }
      $scope.$emit('customers:update', customerInformation);
      if (fromProfile) {
        $ionicHistory.goBack();
      } else {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.customers.list');
      }
    });
  };

  $scope.pickContact = function() {
    ContactIntegration.pickContact(function(contactInformation) {
      angular.extend($scope.userModel, contactInformation);
    });
  };

  $scope.saveCustomer = function() {
    var customerData = angular.copy($scope.userModel);
    var locationData = angular.copy($scope.locationModel);
    locationData.country = $scope.locationModel.country.id;
    if (locationData.country == 'PT') {
      locationData.parish = $scope.locationModel.parish.name;
      locationData.state = $scope.locationModel.state.id;
    } else {
      delete locationData.parish;
      delete locationData.state;
    }
    customerData.location = locationData;
    if (updateCustomer) {
      Customers.update({
          token: $scope.getSessionToken(),
          id: $base64.encode(customer.id)
        }, customerData).$promise
        .then($scope.onUpdate)
        .catch(ErrorHandler.$httpTimeout);
    } else {
      Customers.save({
          token: $scope.getSessionToken()
        }, customerData).$promise
        .then($scope.onCreate)
        .catch(ErrorHandler.$httpTimeout);
    }
  };

  $scope.viewConcelhos = function() {
    ModalProvider.display($scope, ModalProvider.concelhosModal);
  };

  $scope.viewDistritos = function() {
    ModalProvider.display($scope, ModalProvider.distritosModal);
  };

  $scope.viewPaises = function() {
    ModalProvider.display($scope, ModalProvider.paisesModal);
  };

  $scope.refreshConcelhos = function(distritoId) {
    LocationService.getConcelhos(distritoId, function(queryResult) {
      $scope.concelhos = queryResult;
      $scope.locationModel.parish = LocationService.findConcelhos($scope.locationModel.parish);
    }, $scope.getSessionToken());
  };

  LocationService.getDistritos(function(queryResult) {
    $scope.distritos = queryResult;
    $scope.locationModel.state = LocationService.findDistritos($scope.locationModel.state);
    $scope.refreshConcelhos($scope.locationModel.state.id);
  }, $scope.getSessionToken());

  LocationService.getPaises(function(queryResult) {
    $scope.paises = queryResult;
    $scope.locationModel.country = LocationService.findPaises($scope.locationModel.country);
  }, $scope.getSessionToken());
}

function customersView(
  $base64,
  $scope,
  $state,
  $ionicHistory,
  $rootScope,
  customer,
  Customers,
  ErrorHandler,
  PopupProvider,
  ContactIntegration) {
  $scope.customer = customer;

  $scope.onDelete = function(customerInformation) {
    ContactIntegration.removeContact(customerInformation.name, function(operationResult) {
      if (operationResult) {
        ErrorHandler.js(operationResult);
      }
      $scope.$emit('customers:update', customerInformation);
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.customers.list');
    });
  };

  $scope.deleteCustomer = function() {
    PopupProvider.confirmDelete().then(function(dialogResult) {
      if (dialogResult) {
        Customers.delete({
          token: $scope.getSessionToken(),
          id: $base64.encode(customer.id)
        }).$promise.then($scope.onDelete).catch(ErrorHandler.$httpTimeout);
      }
    });
  };

  $scope.updateCustomer = function() {
    $state.go('app.customers-update', {
      profile: true,
      id: customer.id,
      token: $scope.getSessionToken()
    });
  };

  $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
    viewData.enableBack = true;
  });

  $rootScope.$on('customers:update', function(event, queryResult) {
    $scope.customer = queryResult;
  });
}

angular.module('sinforce.customers')
  .controller('CustomersList', customersList)
  .controller('CustomersView', customersView)
  .controller('CustomersController', customersController);