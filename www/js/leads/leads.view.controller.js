function leadView(
  $base64,
  $scope,
  $state,
  $ionicHistory,
  $rootScope,
  DefinitionService,
  Leads,
  ErrorHandler,
  PopupProvider,
  $stateParams, Location) {


  console.log("HERE");
  
  $scope.debug = function(){
    $scope.lead.location.address = "OASKDOASKDKASDOK";
  };


  $scope.initView = function(){
      Leads.get({
           id: $stateParams.id,
           token: $scope.getSessionToken()
      }).$promise.then(function(res){
        console.log(res);
        $scope.lead = res; 
        Location.query({
            token: $scope.getSessionToken()
          }).$promise.then(function(res){
            $scope.districts = res;
            console.log(res);
            $scope.districts.forEach(function(x){
              if(x.id == $scope.lead.location.state){
                $scope.lead.location.state = x.name;
              }
            })
          }, function(err){
            console.log(err);
          });
      }, function(err){
        console.log(err)
      });
  };

  /*$scope.deleteCustomer = function () {
    PopupProvider.confirmDelete().then(function(dialogResult) {
      if (dialogResult) {
        Leads.remove({
          token: $scope.getSessionToken(),
          id: $base64.encode(customer.id)
        }).$promise.then(function() {
          $scope.$emit('lead:delete', customer.id);
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.lead.list');
        }).catch(ErrorHandler.$httpTimeout);
      }
    });
  };*/

    

  console.log("HER");

    DefinitionService.getLeadTypes(function(ret)
    {
        console.log(ret);
        $scope.leadTypes = ret;
    });


  console.log($stateParams);

  $scope.updatelead = function(){
    $state.go('app.leads-update', {
      id: $stateParams.id
    });
  }

  $scope.deletelead = function(){
    PopupProvider.confirmDelete().then(function(dialogResult) {
      if (dialogResult) {
        Leads.remove({
          token: $scope.getSessionToken(),
          id: $stateParams.id
        }).$promise.then(function(res) {
          console.log(res);
          $state.go('app.leads.list');
        }, function(err){
          console.log(err);
        }).catch(ErrorHandler.$httpTimeout);
      }
    });
  }

  $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
    viewData.enableBack = true;
  });

  $rootScope.$on('lead:update', function(event, queryResult) {
    $scope.customer = queryResult;
  });
}

angular.module('sinforce.leads')
.controller('LeadsView', leadView);