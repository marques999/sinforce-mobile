function leadsList(
  $scope,
  $state,
  $rootScope,
  $ionicLoading,
  $ionicModal,
  $q,
  DefinitionService,
  ErrorHandler,
  Leads,
  PopupProvider,
  ContactIntegration) {
  $scope.searchLeads = {};
  $scope.deadLeadId = '004';
  $scope.convertedLeadId = '010';

  function genTypeMap(toMap) {
    var typesmap = {};
    toMap.forEach(function(type) {
      typesmap[type.id] = type.name;
    });
    return typesmap;
  }

  $scope.leadGroupHasTTPs = function(leadArray, types) {
    for (var i = 0; i < leadArray.length; i++) {
      for (var type = 0; type < types.length; type++) {
        if (leadArray[i].thirdPartyType === types[type]) {
          return true;
        }
      }
    }
    return false;
  };

  $scope.leadGroupHasOtherTTPThan = function(leadArray, types) {
    var foundOne;
    for (var i = 0; i < leadArray.length; i++) {
      for (var type = 0; type < types.length; type++) {
        foundOne = false;
        if (leadArray[i].thirdPartyType === types[type]) {
          foundOne = true;
        }
        if (!foundOne) {
          return true;
        }
      }
    }
    return false;
  };

  $scope.countType = function(type) {
    var count = 0;
    for (var i = 0; i < $scope.leads.length; i++) {
      if ($scope.leads[i].thirdPartyType === type) {
        count++;
      }
    }
    //hotfix
    if(type != "005"){
      $scope.leadsClosed.forEach(function(elem){
        if(elem.thirdPartyType === type){
          count++;
        }
      });
    }    
    return count;
  };

  $scope.buildLeadTypesChart = function() {
    $scope.labels2 = [];
    $scope.data2 = [];
    for (var key in $scope.thirdpartytypes) {
      if (key !== 'Converted') {
        $scope.labels2.push($scope.thirdpartytypes[key]);
        $scope.data2.push($scope.countType(key.toString()));
      }
    }
  };

  $scope.refreshLeads = function(fromLoading) {
    if (fromLoading) {
      $ionicLoading.show({
        template: '<p>Por favor aguarde...</p><ion-spinner></ion-spinner>'
      });
    }
    $q.all([
        Leads.query({
          token: $scope.getSessionToken()
        }).$promise,
        DefinitionService.thirdPartyTypes4Leads()
      ])
      .then(function(data) {
        console.log(data);
        $scope.timelineLeads = data[0].filter(function(elem){
            return elem.active
        });
        $scope.leads = data[0].filter(function(elem){
            return elem.active && elem.thirdPartyType != "004" && elem.thirdPartyType != "010";
        });
        $scope.leadsClosed = data[0].filter(function(elem){
          return !elem.active || (elem.thirdPartyType == "004" || elem.thirdPartyType == "010");
        });
        $scope.thirdpartytypes = genTypeMap(data[1]);
        $scope.buildLeadTypesChart();
      })
      .finally(function() {
        if (fromLoading) {
          $ionicLoading.hide();
        } else {
          $scope.$broadcast('scroll.refreshComplete');
        }
      });
  };

  $scope.deleteLeads = function(leadId) {
    PopupProvider.confirmDelete().then(function(dialogResult) {
      if (dialogResult) {
        Leads.remove({
          id: leadId,
          token: $scope.getSessionToken()
        }).$promise.then(function(leadInformation) {
          ContactIntegration.showRemove(leadInformation.name, function(operationResult) {
            if (operationResult) {
              ContactIntegration.removeContact(leadInformation.name);
            }
            $scope.removeFromArray(leadInformation.id);
            $scope.leads.push(leadInformation);
            $state.go('app.leads.list');
          });
        }).catch(ErrorHandler.$httpTimeout);
      }
    });
  };

  $scope.updateLead = function(leadId) {
    $state.go('app.leads-update', {
      id: leadId,
      profile: false,
      token: $scope.getSessionToken()
    });
  };

  $scope.viewLead = function(leadId) {
    $state.go('app.leads-view', {
      id: leadId,
      token: $scope.getSessionToken()
    });
  };

  $scope.removeFromArray = function(leadId) {
    for (var i = 0; i < $scope.leads.length; i++) {
      if ($scope.leads[i].id == leadId) {
        $scope.leads.splice(i, 1);
        return;
      }
    }
  };

  $rootScope.$on('leads:create', function(event, queryResult) {
    $scope.leads.push(queryResult);
  });

  $rootScope.$on('leads:delete', function(event, leadId) {
    $scope.removeFromArray(leadId);
  });

  $rootScope.$on('leads:update', function(event, queryResult) {
    $scope.removeFromArray(queryResult.id);
    $scope.leads.push(queryResult);
  });

  var glyphIcons = {
    '004': {
      icon: 'ion-close-circled',
      color: 'bg-color-red color-black'
    },
    '005': {
      icon: 'ion-plus-circled',
      color: 'bg-color-green color-black'
    },
    '006': {
      icon: 'ion-egg',
      color: 'bg-color-yellow color-white'
    },
    '007': {
      icon: 'ion-chatboxes',
      color: 'bg-color-blue color-white'
    },
    '008': {
      icon: 'ion-magnet',
      color: 'bg-color-yellow color-black'
    },
    '009': {
      icon: 'ion-briefcase',
      color: 'bg-color-white color-green'
    },
    '010': {
      icon: 'ion-person-add',
      color: 'bg-color-white color-blue'
    },
    '': {
      icon: 'ion-help-circled',
      color: 'bg-color-white color-black'
    }
  };

  $scope.getGraphicIcon = function(lead) {
    if (!lead.thirdPartyType) return glyphIcons[''].icon;
    return glyphIcons[lead.thirdPartyType].icon;
  };

  $scope.getGraphicColor = function(lead) {
    if (!lead.thirdPartyType) return glyphIcons[''].color;
    return glyphIcons[lead.thirdPartyType].color;
  };

  $scope.gotoForm = function(id) {
    $state.go('app.leads-create', {
      leadID: id
    });
  };

  $scope.refreshLeads(true);

  //maybe filter by month or year
  //var date = new Date();
  //$scope.thisYear = date.getFullYear() ;
  //$scope.thisMonth = ('0' + (date.getMonth() + 1)).slice(-2);
}

angular.module('sinforce.leads').controller('LeadsList', leadsList);