function prepareLeadForm($scope) {

  $scope.groups = [];

  $scope.groups[0] = {
    name: 'Morada e Contacto',
    items: [{
      name: 'Morada',
      id: 'address',
      value: $scope.leadCreation ? '' : $scope.lead.location.address
    }, {
      name: 'Localidade',
      id: 'parish',
      value: $scope.leadCreation ? '' : $scope.lead.location.parish
    }, {
      name: 'Código Postal',
      id: 'postal',
      value: $scope.leadCreation ? '' : $scope.lead.location.postal
    }, {
      name: 'Telemóvel',
      id: 'mobile',
      value: $scope.leadCreation ? '' : $scope.lead.mobile
    }, {
      name: 'Telefone',
      id: 'phone',
      value: $scope.leadCreation ? '' : $scope.lead.phone
    }, {
      name: 'Email',
      id: 'email',
      value: $scope.leadCreation ? '' : $scope.lead.email
    }],
    show: false
  };

  $scope.groups[1] = {
    name: 'Morada e Contactos Adicionais',
    items: [{
        name: 'Morada Alternativa',
        id: 'address2',
        value: $scope.leadCreation ? '' : $scope.lead.address2
      }, {
        name: 'Telefone Alternativo',
        id: 'phone2',
        value: $scope.leadCreation ? '' : $scope.lead.phone2
      }, {
        name: 'Endereço Web',
        id: 'webAddress',
        value: $scope.leadCreation ? '' : $scope.lead.webAddress
      }
    ],
    show: false
  };

  $scope.groups[2] = {
    name: 'Dados Fiscais',
    show: false
  };

  $scope.groups[3] = {
    name: 'Outros Dados',
    show: false
  };

  $scope.toggleGroup = function (group) {
    group.show = !group.show;
  };

  $scope.isGroupShown = function (group) {
    return group.show;
  };
}

function getFromForm(toGet) {
  var ret = document.getElementById(toGet).value;
  return ret === '' ? null : ret;
}

function updateLead(leadID, Leads, convert2clientORdeadLead, $scope, $state, $stateParams) {
  //var querystring = require('querystring');
  //var http = require('http');
  var name = document.getElementById('name').value;
  //TOAST -> NAME CANT BE NULL
  //replace by regular expression later
  if (name === '') {
    //    $scope.showToast = function(){
    //  ionicToast.show('Nome é obrigatório', 'top', true, 2500);
    //};
    return;
  }

  var leadType = getFromForm('thirdPartyType');

  if (convert2clientORdeadLead === 1) {
    leadType = $scope.deadLeadId;
  }

  if (convert2clientORdeadLead === 2) {
    leadType = $scope.convertedLeadId;
  }

  var formData = {
    name: name,
    email: getFromForm('email'),
    phone: getFromForm('phone'),
    phone2: getFromForm('phone2'),
    mobile: getFromForm('mobile'),
    active: true,
    thirdPartyType: leadType,
    address2: getFromForm('address2'),
    webAddress: getFromForm('webAddress'),
    zone: getFromForm('zone'),
    numCont: getFromForm('numCont'),
    idiom: getFromForm('idiom'),
    singular: document.getElementById('singular').value === 'Singular',
    marketType: document.getElementById('marketType').value,
    location: {
      address: getFromForm('address'),
      postal: getFromForm('postal'),
      parish: getFromForm('parish'),
      state: getFromForm('state'),
      country: getFromForm('country')
    }
  };

  if ($scope.leadCreation) {
    console.log(formData);
    Leads.save({
      token: $scope.getSessionToken()
    }, formData).$promise.then(
      function(res){
        console.log(res);
        $state.go('app.leads.list');
      }, function(err){
        console.log(err);
      }
    ).catch().finally();
  } else {
    Leads.update({
      id: $stateParams.id,
    }, formData).$promise.then(function(res){
      console.log(res);
      $state.go('app.leads.list');
    }, function(err){
      console.log(err);
    }).catch().finally();
  }
}

function leadsController(
  $scope,
  $ionicLoading,
  $ionicModal,
  $stateParams,
  $q,
  $filter,
  ContactIntegration,
  DefinitionService,
  ErrorHandler,
  //leadInformation,
  Leads,
  Location, $state) {

  //var updateLead = !!leadInformation;
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

  if($stateParams.id != undefined){
    var leadId = $stateParams.leadID;
    $scope.leadCreation = false;
  }else{
    $scope.leadCreation = true;
  }

  $scope.deadLeadId = '004';
  $scope.convertedLeadId = '010';
  

  $scope.submitLead = function () {
    updateLead(leadId, Leads, 0, $scope, $state, $stateParams);
  };

  $scope.applyNconvertLead = function () {
    updateLead(leadId, Leads, 2, $scope, $state, $stateParams);
  };


  $scope.refreshTypes = function (fromLoading) {
    if (fromLoading) {
      $ionicLoading.show({
        template: '<p>Por favor aguarde...</p><ion-spinner></ion-spinner>'
      });
    }
    $q.all([
        DefinitionService.thirdPartyTypes4Leads(),
        DefinitionService.countries(),
        DefinitionService.idioms(),
        DefinitionService.zones(),
        Location.query({
          token: $scope.getSessionToken()
        }).$promise, !$scope.leadCreation ? Leads.get({
          id: $stateParams.id,
          token: $scope.getSessionToken()
        }).$promise : null
      ])
      .then(function (queryResult) {
        $scope.thirdpartytypes = queryResult[0];
        $scope.countries = queryResult[1];
        $scope.idioms = queryResult[2];
        $scope.zones = queryResult[3];
        $scope.districts = queryResult[4];

        if (!$scope.leadCreation) {
          $scope.lead = queryResult[5];
        }

        if (!$scope.leadCreation) {
          prepareLeadForm($scope);
        }
      })
      //.catch(ErrorHandler.$('Não foi possível apresentar esta página.'))
      .finally(function () {
        if (fromLoading) {
          $ionicLoading.hide();
        } else {
          $scope.$broadcast('scroll.refreshComplete');
        }
      });
  };

  $scope.pickContact = function() {
    ContactIntegration.pickContact(function(contactInformation) {
      angular.extend($scope.userModel, contactInformation);
    });
  };

  $scope.refreshTypes(true);

  if ($scope.leadCreation) {
    prepareLeadForm($scope);
  }
}

angular.module('sinforce.leads').controller('LeadsController', leadsController);