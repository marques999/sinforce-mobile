function contactsList(
  $scope,
  $state,
  $rootScope,
  Contacts,
  ErrorHandler,
  ModalProvider,
  PopupProvider,
  LocationService,
  ContactIntegration) {
  $scope.contactSearch = {};

  $scope.deleteContact = function(contactInformation) {
    PopupProvider.confirmDelete().then(function(dialogResult) {
      if (dialogResult) {
        Contacts.remove({
          id: contactInformation.id,
          token: $scope.getSessionToken()
        }).$promise.then(function() {
          ContactIntegration.removeContact(contactInformation.name, function(operationResult) {
            if (operationResult) {
              ErrorHandler.js(operationResult);
            }
            $scope.refreshContacts(true);
            $state.go('app.contacts');
          });
        }).catch(ErrorHandler.$httpTimeout);
      }
    });
  };

  $scope.updateContact = function(contactId) {
    $state.go('app.contacts-update', {
      id: contactId,
      profile: false,
      token: $scope.getSessionToken()
    });
  };

  $scope.viewContact = function(contactId) {
    $state.go('app.contacts-view', {
      id: contactId,
      token: $scope.getSessionToken()
    });
  };

  $scope.refreshContacts = function(fromLoading) {
    if (fromLoading) {
      ModalProvider.displayLoading();
    }
    Contacts.query({
      token: $scope.getSessionToken()
    }).$promise.then(function(queryResult) {
      $scope.contacts = queryResult;
    }).catch(ErrorHandler.$httpTimeout).finally(function() {
      if (fromLoading) {
        ModalProvider.hideLoading();
      } else {
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  };

  $scope.removeFromArray = function(contactId) {
    for (var i = 0; i < $scope.contacts.length; i++) {
      if ($scope.contacts[i].id == contactId) {
        $scope.contacts.splice(i, 1);
        return;
      }
    }
  };

  $rootScope.$on('contacts:create', function(event, queryResult) {
    $scope.contacts.push(queryResult);
  });

  $rootScope.$on('contacts:delete', function(event, contactId) {
    $scope.removeFromArray(contactId);
  });

  $rootScope.$on('contacts:update', function(event, queryResult) {
    $scope.removeFromArray(queryResult.id);
    $scope.contacts.push(queryResult);
  });

  $scope.refreshContacts(true);
}

function contactsController(
  $filter,
  $scope,
  $state,
  $cordovaContacts,
  $ionicHistory,
  $stateParams,
  contact,
  Contacts,
  Customers,
  ContactIntegration,
  DefinitionService,
  ErrorHandler,
  LocationService,
  ModalProvider) {
  $scope.entityModel = {};
  $scope.locationService = LocationService;

  var updateContact = !!contact;
  var getNumber = $filter('parseInt');
  var fromProfile = $stateParams.profile || false;

  if (updateContact) {
    $scope.userModel = contact;
    $scope.formTitle = 'EDITAR CONTACTO';
    $scope.previousName = (' ' + contact.name).slice(1);
    $scope.userModel.mobile = getNumber(contact.mobile);
    $scope.userModel.phone = getNumber(contact.phone);
    $scope.userModel.phone2 = getNumber(contact.phone2);
    $scope.locationModel = contact.location;
  } else {
    $scope.formTitle = 'NOVO CONTACTO';
    $scope.userModel = {
      title: null
    };
    $scope.locationModel = {
      parish: null,
      state: null,
      country: 'PT'
    };
  }

  function findCustomer(entityId) {
    if (angular.isDefined(entityId) && entityId !== null) {
      for (var i = 0; i < $scope.customers.length; i++) {
        if ($scope.customers[i].id == entityId) {
          return $scope.customers[i];
        }
      }
    }
    return $scope.customers[0];
  }

  $scope.queryCustomers = function() {
    Customers.query({
      token: $scope.getSessionToken()
    }).$promise.then(function(queryResult) {
      $scope.customers = [{
        id: null,
        name: 'Nenhum'
      }];
      $scope.customers = $scope.customers.concat(queryResult);
      $scope.entityModel.customer = findCustomer($scope.userModel.entity);
    }).catch(ErrorHandler.$httpTimeout);
  };

  $scope.onSelectCustomer = function(){
    $scope.customerModal.hide();
  };

  $scope.onCreate = function(contactInformation) {
    ContactIntegration.insertContact(contactInformation, function(operationResult) {
      if (operationResult) {
        ErrorHandler.js(operationResult);
      }
      $scope.$emit('contacts:create', contactInformation);
      $scope.userModel = {
        title: null
      };
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.contacts');
    });
  };

  $scope.onUpdate = function(contactInformation) {
    ContactIntegration.updateContact($scope.previousName, contactInformation, function(operationResult) {
      if (operationResult) {
        ErrorHandler.js(operationResult);
      }
      $scope.$emit('contacts:update', contactInformation);
      if (fromProfile) {
        $ionicHistory.goBack();
      } else {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.contacts');
      }
    });
  };

  $scope.pickContact = function() {
    ContactIntegration.pickContact(function(contactInformation) {
      angular.extend($scope.userModel, contactInformation);
    });
  };

  $scope.saveContact = function() {
    var contactData = angular.copy($scope.userModel);
    var locationData = angular.copy($scope.locationModel);
    locationData.country = $scope.locationModel.country.id;
    if (locationData.country == 'PT') {
      locationData.parish = $scope.locationModel.parish.name;
      locationData.state = $scope.locationModel.state.id;
    } else {
      delete locationData.parish;
      delete locationData.state;
    }
    contactData.location = locationData;
    contactData.title = $scope.userModel.title.id;
    if ($scope.entityModel.customer) {
      contactData.entity = $scope.entityModel.customer.id;
    } else {
      contactData.entity = null;
    }
    if (updateContact) {
      Contacts.update({
          id: contact.id,
          token: $scope.getSessionToken()
        }, contactData).$promise
        .then($scope.onUpdate)
        .catch(ErrorHandler.$httpTimeout);
    } else {
      Contacts.save({
          token: $scope.getSessionToken()
        }, contactData).$promise
        .then($scope.onCreate)
        .catch(ErrorHandler.$httpTimeout);
    }
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

  DefinitionService.getTitles(function(queryResult) {
    $scope.titles = queryResult;
    $scope.userModel.title = DefinitionService.findTitle($scope.userModel.title);
  }, $scope.getSessionToken());

  $scope.viewConcelhos = function() {
    ModalProvider.display($scope, ModalProvider.concelhosModal);
  };

  $scope.viewCustomers = function() {
    ModalProvider.display($scope, ModalProvider.customerModal);
  };

  $scope.viewDistritos = function() {
    ModalProvider.display($scope, ModalProvider.distritosModal);
  };

  $scope.viewPaises = function() {
    ModalProvider.display($scope, ModalProvider.paisesModal);
  };

  $scope.viewTitles = function() {
    ModalProvider.display($scope, ModalProvider.titleModal);
  };

  $scope.queryCustomers();
}

function contactsView(
  $scope,
  $state,
  $ionicHistory,
  $cordovaEmailComposer,
  ContactIntegration,
  $rootScope,
  contact,
  Contacts,
  ErrorHandler,
  PopupProvider) {
  $scope.contact = contact;

  $scope.onDelete = function() {
    ContactIntegration.removeContact($scope.contact.name, function(operationResult) {
      if (operationResult) {
        ErrorHandler.js(operationResult);
      }
      $scope.$emit('contacts:delete', $scope.contact.id);
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.contacts');
    });
  };

  $scope.deleteContact = function() {
    PopupProvider.confirmDelete().then(function(dialogResult) {
      if (dialogResult) {
        Contacts.remove({
          id: contact.id,
          token: $scope.getSessionToken()
        }).$promise.then($scope.onDelete).catch(ErrorHandler.$httpTimeout);
      }
    });
  };

  $scope.updateContact = function() {
    $state.go('app.contacts-update', {
      profile: true,
      id: contact.id,
      token: $scope.getSessionToken()
    });
  };

  $scope.sendEmail = function(emailAddress) {
    $cordovaEmailComposer.isAvailable().then(function() {
      $cordovaEmailComposer.open({
        to: emailAddress,
        subject: 'sinFORCE',
        isHtml: true
      });
    }).catch(ErrorHandler.js);
  };

  $rootScope.$on('contacts:update', function(event, queryResult) {
    $scope.contact = queryResult;
  });
}

angular.module('sinforce.contacts')
  .controller('ContactsList', contactsList)
  .controller('ContactsView', contactsView)
  .controller('ContactsController', contactsController);