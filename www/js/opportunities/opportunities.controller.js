function opportunitiesController(
  $http,
  $scope,
  opportunities,
  ApiConfiguration,
  ErrorHandler,
  ModalProvider,
  Opportunities,
  OpportunitiesConstants,
  PopupProvider,
  $state) {

  $scope.pieChartDefaultOptions = {      
        legend: {
          position: 'bottom',
	        display: true	        
	    }        
    };

  $scope.opportunities = opportunities.filter(function(elem){
    return elem.status === 0;
  });

  $scope.inactiveOpportunities = [];

  opportunities.forEach(function(opp){
    if(opp.status != 0){
      $scope.inactiveOpportunities.push(opp);
    }
  });


  $scope.tiposCliente = [];
  OpportunitiesConstants.entity.forEach(function(x){
    if(x.descricao == "Nenhuma")
      return;
    $scope.tiposCliente.push(x.descricao);
  });

  $scope.tiposOrigem = [];
  OpportunitiesConstants.origem.forEach(function(x){
    $scope.tiposOrigem.push(x.descricao);
  });


  $scope.dataStructure = function(){

    $scope.tiposClienteData = [0,0,0];
    $scope.tiposOrigemData = [0,0,0,0,0,0];
    $scope.nomeClientes = [];
    $scope.entidade = [];
    $scope.entitiesName = [];
    $scope.opportunities.forEach(function(x){
      switch(x.entityType){
        case 'C':
          $scope.tiposClienteData[1]++;
          break;
        case 'X':
          $scope.tiposClienteData[0]++;
          break;
        case 'L':
          $scope.tiposClienteData[2]++;
          break;
      }
      switch(x.origin){
        case 'ANUN':
          $scope.tiposOrigemData[0]++;
          break;
        case 'EMAIL':
          $scope.tiposOrigemData[1]++;
          break;
        case 'FAX':
          $scope.tiposOrigemData[2]++;
          break;
        case 'REF':
          $scope.tiposOrigemData[3]++;
          break;
        case 'TEL':
          $scope.tiposOrigemData[4]++;
          break;
        case 'WEB':
          $scope.tiposOrigemData[5]++;
          break;
      }
      if($scope.entidade[x.entity] == undefined){
        $scope.entidade[x.entity] = [];
        $scope.entidade[x.entity].occur = 1;
        $scope.entidade[x.entity].totalOV = x.totalValueOV;
        $scope.entidade[x.entity].marginOV = x.marginOV;
      }else{
        $scope.entidade[x.entity].occur++;
        $scope.entidade[x.entity].totalOV += x.totalValueOV;
        $scope.entidade[x.entity].marginOV += x.marginOV;
      }
    });

    $scope.values = [];
    $scope.values[0] = [];
    $scope.values[1] = [];
    for(x in $scope.entidade){
      $scope.values[0].push($scope.entidade[x].totalOV.toFixed(2));
      $scope.values[1].push($scope.entidade[x].marginOV.toFixed(2));
      $scope.entidade.push($scope.entidade[x].occur);
      $scope.entitiesName.push(x);
    }

    $scope.inactiveOpportunities.forEach(function(x){

    });
  }

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
    'ion-plus',
    'ion-compose',
    'ion-close-circled'
  ];

  function getOpportunityStatus(opportunityStatus) {
    if (opportunityStatus.description == 'DELETED') {
      return 2;
    }
    if (opportunityStatus.dateCreated == opportunityStatus.dateModified) {
      return 0;
    }
    return 1;
  }

  $scope.getTimelineDescription = function(opportunityStatus) {
    return timelineDescription[getOpportunityStatus(opportunityStatus)];
  };

  $scope.getTimelineColor = function(opportunityStatus) {
    return timelineColor[getOpportunityStatus(opportunityStatus)];
  };

  $scope.getTimelineIcon = function(opportunityStatus) {
    return timelineIcon[getOpportunityStatus(opportunityStatus)];
  };

  $scope.getSingleOpportunity = function (ID) {
    Opportunities.get({
      id: ID
    }).$promise.then(function (res) {
      console.log(res);
    }, function (err) {
      console.log(err);
    });
  };


  /*$scope.getOpportunities = function(){
      Opportunities.query().$promise.then(function(res){
      $scope.opportunity = res;
      console.log($scope.opportunity);
    }, function(err){
      console.log(err);
    });
  }*/

  $scope.goToViewOpportunity = function(id){
    $state.go('app.opportunities-view', 
      {id: id.replace(/{/g,'').replace(/}/g,'')}
    );
  }

  $scope.deleteOpportunity = function (opportunityId) {
    PopupProvider.confirmDelete().then(function (dialogResult) {
      if (dialogResult) {
        $http({
          method: 'DELETE',
          url: ApiConfiguration.endpoint + '/api/opportunities/' + opportunityId,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            opportunity: opportunityId
          }
        }).then(function (succ) {
          console.log(succ);
          $scope.refreshOpportunities(false);
        }, function (err) {
          console.log(err);
        });
      } else {
        console.log('Pressed NO');
      }
    });
  };

  $scope.viewOpportunity = function (opportunityId) {
    if (!$scope.opportunity || $scope.opportunity.id !== opportunityId) {
      Opportunities.get({
        id: opportunityId
      }).$promise.then(function (queryResult) {
        $scope.opportunity = queryResult;
        ModalProvider.display($scope, ModalProvider.opportunityModal);
      }).catch(ErrorHandler.$httpTimeout);
    } else {
      ModalProvider.display($scope, ModalProvider.opportunityModal);
    }
  };

  $scope.refreshOpportunities = function (fromLoading) {
    if (fromLoading) {
      ModalProvider.displayLoading();
    }
    Opportunities.query().$promise.then(function (queryResult) {
      $scope.opportunities = queryResult.filter(function(elem){
          return elem.status === 0;
      });

      $scope.inactiveOpportunities = [];

      queryResult.forEach(function(opp){
        if(opp.status != 0){
          $scope.inactiveOpportunities.push(opp);
        }
      });
      console.log($scope.inactiveOpportunities);
      $scope.dataStructure();
    }).catch(ErrorHandler.$httpTimeout).finally(function () {
      if (fromLoading) {
        ModalProvider.hideLoading();
      } else {
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  };
}

function registerOpportunity(
  $scope,
  $state,
  ErrorHandler,
  OpportunitiesConstants,ModalProvider,Customers,EntityFactory,Users,DefinitionService,
  Opportunities) {

  var d = new Date();

  $scope.opportunityModel = {};
  $scope.formIsDisabled = false;
  $scope.submitField = 'Registar';
  $scope.formTitle = 'NOVA OPORTUNIDADE';

  $scope.zonas = OpportunitiesConstants.zona;
  $scope.sellsCycle = OpportunitiesConstants.sellsCycle;
  $scope.origem = OpportunitiesConstants.origem;
  $scope.entities = OpportunitiesConstants.entity;
  $scope.estados = OpportunitiesConstants.state;

  //$scope.contacts = contacts;
  //console.log(contacts);

  $scope.querySellers = function(){
    Users.query().$promise.then(function(queryResult) {
      $scope.representatives = queryResult;
    }).catch(ErrorHandler.$httpTimeout);
  }

  $scope.queryCampaigns = function(){
    DefinitionService.getCampaigns(function(res){
      console.log(res);
      $scope.campaigns = res;
    });
  }


  $scope.queryCustomers = function() {
    Customers.query({
      token: $scope.getSessionToken()
    }).$promise.then(function(queryResult) {
      $scope.customers = [{
        id: null,
        name: 'Nenhum'
      }];
      $scope.contacts = $scope.customers.concat(queryResult);
      console.log($scope.contacts);
      //$scope.entityModel.customer = findCustomer($scope.customers, $scope.userModel.entity);
    }).catch(ErrorHandler.$httpTimeout);
  };

  $scope.viewZones = function(){
    ModalProvider.display($scope, ModalProvider.zonasModal);
  }

  $scope.viewSellCycle = function(){
    ModalProvider.display($scope, ModalProvider.sellscycleModal);
  }

  $scope.viewOrigin = function(){
    ModalProvider.display($scope, ModalProvider.originModal);
  }

  $scope.viewCampaigns = function(){
    $scope.queryCampaigns();
    ModalProvider.display($scope, ModalProvider.campaignModal)
  }
  $scope.viewSources = function(){
    ModalProvider.display($scope, ModalProvider.entitiesModal);
  }

  $scope.viewEntities = function(){
    $scope.refreshEntities();
    ModalProvider.display($scope, ModalProvider.clientsModal);
  }

  $scope.viewStates = function(){
    ModalProvider.display($scope, ModalProvider.statesModal);
  }

  $scope.refreshEntities = function() {
    EntityFactory.getEntities($scope.opportunityForm.entityType, function(queryResult) {
      $scope.contacts = queryResult;
    }, $scope.getSessionToken());
  };

  $scope.updateMargin = function(){
    if($scope.opportunityForm.totalValueOV != 0)
      $scope.opportunityForm.marginPercOV = $scope.opportunityForm.marginOV / $scope.opportunityForm.totalValueOV;
    else
      $scope.opportunityForm.marginPercOV = -1;
  }

  var defaultValue = function () {
    $scope.dates = {
      dateOrdered: new Date(),
      dateExpiration: new Date(),
      realDateOrdered: d.toISOString(),
    }
    return {
      entity: '',
      campaign: '',
      dateOrdered: d,
      realDateOrdered: d.toISOString(),
      zone: '',
      realBillingDate: d.toISOString(),
      closureDate: d.toISOString(),
      opportunity: '',
      seller: '2',
      createdBy: 'user',
      currency: 'EUR',
      brief: '',
      entityType: '',
      status: 0
    };
  };

  $scope.onSuccess = function (operationResult) {
    console.log(operationResult);
    $state.go('app.opportunities.list');
    $scope.opportunityForm = defaultValue();
  };

  $scope.opportunityForm = defaultValue();

  $scope.saveOpportunity = function () {
    $scope.opportunityForm.dateOrdered = $scope.dates.dateOrdered.toISOString();
    $scope.opportunityForm.dateExpiration = $scope.dates.dateExpiration.toISOString();

    console.log($scope.opportunityForm);
    Opportunities.save($scope.opportunityForm).$promise
      .then($scope.onSuccess)
      .catch(ErrorHandler.$httpTimeout);
  };

  $scope.action = $scope.saveOpportunity;
}

function updateOpportunity(
  $scope,
  $state,
  $stateParams,
  ErrorHandler,
  OpportunitiesConstants,ModalProvider,Customers,EntityFactory,Users,DefinitionService,
  Opportunities) {

  $scope.opportunityModel = undefined;
  $scope.formTitle = 'EDITAR OPORTUNIDADE';

  var d = new Date();

  $scope.formIsDisabled = false;
  $scope.submitField = "Atualizar";

  var oldId;

  $scope.zonas = OpportunitiesConstants.zona;
  $scope.sellsCycle = OpportunitiesConstants.sellsCycle;
  $scope.origem = OpportunitiesConstants.origem;
  $scope.entities = OpportunitiesConstants.entity;
  $scope.estados = OpportunitiesConstants.state;

  $scope.querySellers = function(){
    Users.query().$promise.then(function(queryResult) {
      $scope.representatives = queryResult;
    }).catch(ErrorHandler.$httpTimeout);
  }

  $scope.queryCampaigns = function(){
    DefinitionService.getCampaigns(function(res){
      console.log(res);
      $scope.campaigns = res;
    });
  }


  $scope.queryCustomers = function() {
    Customers.query({
      token: $scope.getSessionToken()
    }).$promise.then(function(queryResult) {
      $scope.customers = [{
        id: null,
        name: 'Nenhum'
      }];
      $scope.contacts = $scope.customers.concat(queryResult);
      //$scope.entityModel.customer = findCustomer($scope.customers, $scope.userModel.entity);
    }).catch(ErrorHandler.$httpTimeout);
  };

  $scope.viewZones = function(){
    ModalProvider.display($scope, ModalProvider.zonasModal);
  }

  $scope.viewSellCycle = function(){
    ModalProvider.display($scope, ModalProvider.sellscycleModal);
  }

  $scope.viewOrigin = function(){
    ModalProvider.display($scope, ModalProvider.originModal);
  }

  $scope.viewCampaigns = function(){
    $scope.queryCampaigns();
    ModalProvider.display($scope, ModalProvider.campaignModal)
  }
  $scope.viewSources = function(){
    console.log($scope.entities);
    ModalProvider.display($scope, ModalProvider.entitiesModal);
  }

  $scope.viewEntities = function(){
    $scope.refreshEntities();
    ModalProvider.display($scope, ModalProvider.clientsModal);
  }

  $scope.viewStates = function(){
    ModalProvider.display($scope, ModalProvider.statesModal);
  }

  $scope.refreshEntities = function() {
    EntityFactory.getEntities($scope.opportunityForm.entityType, function(queryResult) {
      $scope.contacts = queryResult;
    }, $scope.getSessionToken());
  };

  $scope.updateMargin = function(){
    if($scope.opportunityForm.totalValueOV != 0)
      $scope.opportunityForm.marginPercOV = $scope.opportunityForm.marginOV / $scope.opportunityForm.totalValueOV;
    else
      $scope.opportunityForm.marginPercOV = -1;
  }

  Opportunities.get({
    id: $stateParams.id
  }).$promise.then(function (res) {
    console.log(res);
    oldId = res.opportunity;
    $scope.opportunityForm = {
      entity: res.entity,
      campaign: res.campaign,
      sellscycle: res.sellscycle,
      description: res.description,
      marginOV: res.marginOV,
      marginPercOV: res.marginPercOV,
      origin: res.origin,
      orderValueOV: res.orderValueOV,
      proposedValueOV: res.proposedValueOV,
      zone: res.zone,
      seller: '2',
      createdBy: 'user',
      lossMotive: res.lossMotive,
      opportunity: res.opportunity,
      currency: res.currency,
      brief: res.brief,
      entityType: res.entityType,
      status: res.status,
      totalValueOV: res.totalValueOV
    };
    $scope.dates = {
      dateOrdered: new Date(res.dateCreated),
      dateExpiration: new Date(res.dateExpiration),
      realDateOrdered: d.toISOString(),
    }
    console.log(res);
    $scope.updateMargin();
  }, function (err) {
    console.log(err);
  });

  $scope.onSuccess = function (operationResult) {
    console.log(operationResult);
    $state.go('app.opportunities.list');
  };

  $scope.saveOpportunity = function () {

    $scope.opportunityForm.dateOrdered = $scope.dates.dateOrdered.toISOString();
    $scope.opportunityForm.dateExpiration = $scope.dates.dateExpiration.toISOString();

    Opportunities.update({
        id: $scope.opportunityForm.opportunity
      }, $scope.opportunityForm).$promise
      .then($scope.onSuccess)
      .catch(ErrorHandler.$httpTimeout);
  };

  $scope.action = $scope.saveOpportunity;
}

function viewOpportunity($scope, ErrorHandler, Opportunities, $stateParams, $state, OpportunitiesConstants, Proposals, AgendaConstants, ModalProvider) {

  $scope.opportunityModel = undefined;
  $scope.formTitle = 'VISUALIZAR OPORTUNIDADE';

  var oldId;
  var d = new Date();

  $scope.formIsDisabled = true;
  $scope.submitField = "Retroceder";

  $scope.updateSalesState = function(val){
    Opportunities.update({id: $scope.opportunityForm.opportunity},{
      status: val,
      lossMotive: $scope.opportunityForm.lossMotive
    }).$promise.then(function(res){
      console.log(res);
    }, function(err){
      console.log(err);
    });

    $state.go('app.opportunities.list');
  }

  $scope.updateMargin = function(){
    if($scope.opportunityForm.totalValueOV != 0)
      $scope.opportunityForm.marginPercOV = $scope.opportunityForm.marginOV / $scope.opportunityForm.totalValueOV;
    else
      $scope.opportunityForm.marginPercOV = -1;
  }

  $scope.viewStates = function(){
    if($scope.opportunityForm.status == "Aberta"){
      ModalProvider.display($scope, ModalProvider.opportunityStatusModal);
    }
     
  }

  $scope.initializeView  = function(){
    console.log("HERE");
    Opportunities.get({
      id: $stateParams.id
    }).$promise.then(function (res) {
      oldId = res.opportunity;
      switch(res.status){
        case 0:
          res.status = "Aberta";
          break;
        case 1:
          res.status = "Ganha";
          break;
        case 2:
          res.status = "Perdida";
          break;
      }
      $scope.opportunityForm = {
        entity: res.entity,
        campaign: res.campaign,
        sellscycle: res.sellscycle,
        description: res.description,
        marginOV: 0,
        marginPercOV: 0,
        origin: res.origin,
        orderValueOV: res.orderValueOV,
        proposedValueOV: res.proposedValueOV,
        zone: res.zone,
        status: res.status,
        seller: '2',
        createdBy: 'user',
        lossMotive: res.lossMotive,
        opportunity: res.opportunity,
        currency: res.currency,
        brief: res.brief,
        entityType: res.entityType,
        totalValueOV: 0,
        id: res.id
      };
      OpportunitiesConstants.zona.forEach(function(elem){
        if(elem.id == res.zone){
          $scope.opportunityForm.zone = elem.descricao;
        }
      });
      OpportunitiesConstants.origem.forEach(function(elem){
        if(elem.origem == res.origin){
          $scope.opportunityForm.origin = elem.descricao;
        }
      })
      $scope.opportunityForm.entityType = AgendaConstants.origens[res.entityType];
      $scope.dates = {
        dateOrdered: new Date(res.realDateOrdered),
        dateExpiration: new Date(res.dateExpiration),
        realDateOrdered: d.toISOString(),
      }
      Proposals.query({id: res.id.replace(/{/g,'').replace(/}/g,'')}).$promise.then(function(res){
        console.log(res);
        $scope.cost = 0;
        $scope.value = 0;
        $scope.margin = 0;
        $scope.proposals = res;
        $scope.proposals.forEach(function(elem){
          if(!elem.totalize){
            elem.proposallines.forEach(function(line){
              $scope.cost += line.costPrice;
              $scope.value += line.sellsPrice;
              $scope.margin += line.margin;
            });
            if(elem.entityDiscount != 0)
              $scope.opportunityForm.totalValueOV += $scope.value * ((100 - elem.entityDiscount) / 100);
            else
              $scope.opportunityForm.totalValueOV += $scope.value;

            $scope.opportunityForm.marginOV += $scope.margin;
            $scope.cost = 0;
            $scope.value = 0;
            $scope.margin = 0;
          }
        });
        $scope.opportunityForm.marginPercOV += ($scope.opportunityForm.marginOV / $scope.opportunityForm.totalValueOV) * 100;

        $scope.opportunityForm.marginPercOV = $scope.opportunityForm.marginPercOV.toFixed(2);
        $scope.opportunityForm.marginOV = $scope.opportunityForm.marginOV.toFixed(2);
        $scope.opportunityForm.totalValueOV = $scope.opportunityForm.totalValueOV.toFixed(2); 

        if(res.length != 0){
          Opportunities.update({id: $scope.opportunityForm.opportunity},{
            marginOV: $scope.opportunityForm.marginOV,
            marginPercOV: $scope.opportunityForm.marginPercOV,
            totalValueOV: $scope.opportunityForm.totalValueOV
          }).$promise.then(function(result){
            console.log(result);
          }, function(err){
            console.log(err);
          });
        }
        
      }, function(err){
        console.log(err);
      });
      $scope.updateMargin();
      $scope.$broadcast('scroll.refreshComplete');
      console.log(res);
    }, function (err) {
      console.log(err);
    });
  }

  $scope.viewProposal = function(oppId, propNumber){
    $state.go('app.proposals-view', {id : oppId.replace(/{/g,'').replace(/}/g,''),
                                  propNumber : propNumber});
  }

  $scope.createProposal = function(oppId){
    $state.go('app.proposals-register', {
      id: oppId.replace(/{/g,'').replace(/}/g,'')
    });
  }

  $scope.action = function (operationResult) {
    $state.go('app.opportunities.list');
  };
}

function viewProposal($scope, $state, $stateParams, ErrorHandler, Proposals, proposals, OpportunitiesConstants, ProposalsLine, $filter){
  $scope.formIsDisabled = true;

  $scope.titleText = "VISUALIZAR PROPOSTA";
  $scope.submitField = "Adicionar Artigo";

  OpportunitiesConstants.paymentMethod.forEach(function(elem){
    if(elem.id == proposals.paymentmethod)
      proposals.paymentmethod = elem.description;
  });

  OpportunitiesConstants.paymentConditions.forEach(function(elem){
    if(elem.id == proposals.paymentcondition)
      proposals.paymentcondition = elem.description;
  });


  $scope.proposalsForm = proposals;
  if(!$scope.proposalsForm.totalize){
    $scope.infoTotalize = 'Proposta contribui para os totais da OV';
  }else{
    $scope.infoTotalize = 'Proposta não contribui para os totais da OV';
  }
  console.log($scope.proposalsForm);

  $scope.getAllProposalsLine = function(){
    $scope.proposalsForm.rentability = 0;
    $scope.proposalsForm.discountValue = 0;
    $scope.proposalsForm.cost = 0;
    $scope.proposalsForm.value = 0;
    $scope.proposalsForm.margin = 0;
    ProposalsLine.query({
      id: $stateParams.id,
      propNumber: $stateParams.propNumber
    }).$promise.then(function(res){
      $scope.proposalLine = res;
      $scope.proposalLine.forEach(function(elem){
        $scope.proposalsForm.cost += elem.costPrice;
        $scope.proposalsForm.value += elem.sellsPrice;
        $scope.proposalsForm.margin += elem.margin;
      });

      if($scope.proposalsForm.entityDiscount !== 0)
        $scope.proposalsForm.discountValue = ($scope.proposalsForm.value * ($scope.proposalsForm.entityDiscount / 100)).toFixed(2);;

      $scope.proposalsForm.rentability = ($scope.proposalsForm.margin - $scope.proposalsForm.discountValue).toFixed(2);
      $scope.proposalsForm.value = $scope.proposalsForm.value.toFixed(2);
      $scope.proposalsForm.cost = $scope.proposalsForm.cost.toFixed(2);
      $scope.proposalsForm.margin = $scope.proposalsForm.margin.toFixed(2);
      $scope.$broadcast('scroll.refreshComplete');
    }, function(err){
      console.log(err);
    });
  }
  $scope.viewProposalLine = function(id, propNumber, line){
    $state.go('app.proposalsline-view', {
      id: id.replace(/{/g,'').replace(/}/g,''),
      propNumber: propNumber,
      line: line
    });
  }

  $scope.goToOpportunity = function(){
    $state.go('app.opportunities-view', 
      {id: $stateParams.id}
    );
  }

  $scope.deleteProposal = function(){
    Proposals.delete({
      id: $stateParams.id,
      propNumber: $stateParams.propNumber
    }).$promise.then(function(res){
      console.log(res);
      $state.go('app.opportunities.list');
    }, function(err){
      $state.go('app.opportunities.list');
      console.log(err);
    });
  }

  $scope.action = function (operationResult) {
    $state.go('app.proposalsline-register', {
      id: $stateParams.id,
      propNumber: $stateParams.propNumber
    });
  };
}

function registerProposal($scope, $state, $stateParams, ErrorHandler, Proposals, OpportunitiesConstants, ModalProvider){
  $scope.formIsDisabled = false;

  $scope.titleText = "CRIAR PROPOSTA";
  $scope.submitField = "Criar";
  $scope.paymentMethod = OpportunitiesConstants.paymentMethod;
  $scope.paymentCondition = OpportunitiesConstants.paymentConditions;

  $scope.viewPaymentMethod = function(){
    ModalProvider.display($scope, ModalProvider.paymentMethodModal);
  }

  $scope.viewPaymentCondition = function(){
    ModalProvider.display($scope, ModalProvider.paymentConditionModal);
  }

  $scope.proposalsForm = {
    idOportunidade: $stateParams.id,
    proposallines: null
  };

  $scope.getAllProposalsLine = function(){
    Proposals.query({
      id: $stateParams.id,
    }).$promise.then(function(res){
      $scope.proposalnumber = 1;
      $scope.proposalsForm.proposalnumber = 1;
      res.forEach(function(x){
        if(x.proposalnumber >= $scope.proposalnumber)
          $scope.proposalsForm.proposalnumber = x.proposalnumber + 1;
      });
      console.log($scope.proposalnumber);
      console.log(res);
    }, function(err){
      console.log(err);
    });
  }

  console.log($stateParams);

  $scope.saveProposal = function(){
    Proposals.save({ id: $stateParams.id}, $scope.proposalsForm).$promise.then(function(res){
      console.log(res);

      $state.go('app.proposals-view', {
        id: $stateParams.id,
        propNumber: $scope.proposalsForm.proposalnumber
      });
    }, function(err){
      console.log(err);
    });
  }

  $scope.action = $scope.saveProposal;

}

function registerProposalLine($scope, $state, $stateParams, ErrorHandler, Proposals, OpportunitiesConstants, ModalProvider, Products, ProposalsLine, $base64){
  $scope.formIsDisabled = false;

  $scope.titleText = "CRIAR LINHA DE PROPOSTA";
  $scope.submitField = "Criar";
  $scope.paymentMethod = OpportunitiesConstants.paymentMethod;
  $scope.paymentCondition = OpportunitiesConstants.paymentConditions;


  $scope.selectProduct = function(){
    Products.query({
        token: $scope.getSessionToken()
    }).$promise.then(function(res){
      $scope.products = res;
      console.log(res);
    }, function(err){
      console.log(err);
    })
    ModalProvider.display($scope, ModalProvider.productSelectionModal);
  }

  $scope.getAllProposalsLine = function(){
    ProposalsLine.query({
      id: $stateParams.id,
      propNumber: $stateParams.propNumber
    }).$promise.then(function(res){
      $scope.line = 1;
      $scope.proposalsLineForm.line = 1;
      res.forEach(function(x){
        if(x.line >= $scope.line)
          $scope.proposalsLineForm.line = x.line + 1;
      });
      console.log($scope.line);
      console.log(res);
    }, function(err){
      console.log(err);
    });
  }

  $scope.proposalsLineForm = {
    idOportunidade: $stateParams.id,
    proposalnumber: parseInt($stateParams.propNumber),
    factorConv: 1
  };

  $scope.saveProposal = function(){
    console.log($scope.proposalsLineForm);
    ProposalsLine.save(
      $scope.proposalsLineForm
    ).$promise.then(function(res){
      console.log(res);
      $state.go('app.proposals-view',{
        id: $stateParams.id,
        propNumber: $stateParams.propNumber
      });
    }, function(err){
      console.log(err);
    });
  }

  $scope.updateValues = function(){
     $scope.proposalsLineForm.costPrice = ($scope.proposalsLineForm.quantity * $scope.proposalsLineForm.ppunit).toFixed(2); 
  };

  $scope.updateMargin = function(){
    $scope.proposalsLineForm.margin = ($scope.proposalsLineForm.sellsPrice - $scope.proposalsLineForm.costPrice).toFixed(2);
  }

  $scope.changeValue = function(res){
    console.log(res);
    $scope.proposalsLineForm.article = res.id;
    $scope.proposalsLineForm.description = res.name;
    $scope.proposalsLineForm.unit = res.units;
    Products.get({
        id: $base64.encode(res.id),
        token: $scope.getSessionToken()
      }).$promise.then(function(userQuery) {
        $scope.product = userQuery;
        $scope.proposalsLineForm.ppunit = userQuery.average.toFixed(2);
        console.log($scope.product);
      }, function(err){
        console.log(err);
      });
  }

  $scope.action = $scope.saveProposal;

}

function viewProposalLine($scope, $state, $stateParams, ErrorHandler, Proposals, OpportunitiesConstants, ProposalsLine, ModalProvider, Products, $base64){
  $scope.formIsDisabled = true;
  $scope.queryComplete = false;

  $scope.titleText = "VER LINHA PROPOSTA";
  $scope.submitField = "Retroceder";
  $scope.editButtonText = "Ativar edição";
  $scope.paymentMethod = OpportunitiesConstants.paymentMethod;
  $scope.paymentCondition = OpportunitiesConstants.paymentConditions;

  $scope.activateEdition = function(){
    $scope.formIsDisabled = !$scope.formIsDisabled;
    if($scope.formIsDisabled)
      $scope.editButtonText = "Ativar edição";
    else
      $scope.editButtonText = "Desativar edição";
  }

  $scope.changeValue = function(res){
    $scope.proposalsLineForm.article = res.id;
    $scope.proposalsLineForm.description = res.name;
    $scope.proposalsLineForm.unit = res.units;
  }

  $scope.selectProduct = function(){
    Products.query({
        token: $scope.getSessionToken()
    }).$promise.then(function(res){
      $scope.products = res;
      console.log(res);
    }, function(err){
      console.log(err);
    })
    ModalProvider.display($scope, ModalProvider.productSelectionModal);
  }

  $scope.getProposalsLine = function(){
    ProposalsLine.get({
      id: $stateParams.id,
      propNumber: $stateParams.propNumber,
      line: $stateParams.line
    }).$promise.then(function(res){
      $scope.proposalsLineForm = res;
      Products.get({
        id: $base64.encode($scope.proposalsLineForm.article),
        token: $scope.getSessionToken()
      }).$promise.then(function(userQuery) {
        $scope.queryComplete = true;
        $scope.product = userQuery;
        $scope.proposalsLineForm.ppunit = userQuery.average.toFixed(2);
        console.log($scope.product);
      }, function(err){
        console.log(err);
    });
      console.log($scope.proposalsLineForm);
      console.log(res);
    }, function(err){
      console.log(err);
    });
  }

  $scope.action = function(){
    $state.go('app.proposals-view', {
      id: $stateParams.id,
      propNumber: $stateParams.propNumber
    });
  }

  $scope.editProposalLine = function(){
    ProposalsLine.update({
      id: $stateParams.id
    }, $scope.proposalsLineForm).$promise.then(function(res){
      console.log(res);
    }, function(err){
      console.log(err);
    });
  }
}

angular.module('sinforce.opportunities')
  .controller('RegisterOpportunity', registerOpportunity)
  .controller('UpdateOpportunity', updateOpportunity)
  .controller('ViewOpportunity', viewOpportunity)
  .controller('ViewProposal', viewProposal)
  .controller('RegisterProposal', registerProposal)
  .controller('RegisterProposalLine', registerProposalLine)
  .controller('ViewProposalLine', viewProposalLine)
  .controller('OpportunitiesController', opportunitiesController);