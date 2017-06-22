function registerQuote(
  $scope,
  $state,
  $ionicHistory,
  $ionicModal,
  $base64,
  $filter,
  $ionicPopup,
  ErrorHandler,
  Customers,
  ModalProvider,
  Products,
  Location,
  LocationService,
  Quotes) {

  $scope.quoteModel = {};

  $scope.goHome = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.quotes.list');
    $ionicHistory.clearHistory();
  };

   $scope.saveQuote = function() {
    var quoteModel = {
      clientRef: $scope.entityModel.customer.id,
      clientName: $scope.entityModel.customer.name,
      taxPayNumb: $scope.customer.taxNumber,
      shippingAddress: {
        address: $scope.customer.location.address,
        postal: $scope.customer.location.postal,
        parish: $scope.customer.location.parish,
        state: $scope.locationModel.state.id,
        country: $scope.locationModel.country.id
      },
      products: []
    };

    for(var i in $scope.quoteProducts) {
      quoteModel.products.push({
        product: {
          id: $scope.quoteProducts[i].id
        },
        price: $scope.quoteProducts[i].average,
        discount: $scope.quoteProducts[i].discount,
        quantity: $scope.quoteProducts[i].quantity
      });
    }

    ModalProvider.displayLoading();
    Quotes.save(quoteModel).$promise.then(function(operationResult) {
      ModalProvider.hideLoading();
      $ionicPopup.alert({
        title: 'Sucesso!',
        template: 'Encomenda Criada.'
      }).then(function() {
        $scope.userModel = {
          title: null
        };
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.quotes.list');
      });
    }).catch(ErrorHandler.$httpTimeout).finally(function() {
        ModalProvider.hideLoading();
    });
  };

  $scope.entityModel = {customer: {}};

  $scope.openCostumersModal = function() {
    if($scope.customers === undefined) {
      ModalProvider.displayLoading();
      Customers.query({
        token: $scope.getSessionToken()
      }).$promise.then(function(queryResult) {
        $scope.customers = queryResult;
        ModalProvider.display($scope, ModalProvider.customerModal);
      }).catch(ErrorHandler.$httpTimeout).finally(function() {
        ModalProvider.hideLoading();
      });
    }
    else {
       ModalProvider.display($scope, ModalProvider.customerModal);
    }
  };

   $scope.customer = {};

  $scope.onSelectCustomer = function(){
    $scope.customerModal.hide();
    if($scope.entityModel.customer.id !== undefined) {
      Customers.get({
        id: $base64.encode($scope.entityModel.customer.id),
        token: $scope.getSessionToken()
      }).$promise.then(function(queryResult) {
        console.log(queryResult);
        queryResult.taxNumber = parseInt(queryResult.taxNumber);
        $scope.locationModel.country.name = $filter('isoCountry')(queryResult.location.country);
        $scope.locationModel.country.id = queryResult.location.country;
        $scope.locationModel.state = LocationService.findDistritos(queryResult.location.state);
        $scope.customer = queryResult;
      }).catch(ErrorHandler.$httpTimeout);
    }
 };

  $scope.productsModel = {product: {}};

  $scope.openProductModal = function() {
    if($scope.products === undefined) {
      ModalProvider.displayLoading();
      Products.query({
        token: $scope.getSessionToken()
      }).$promise.then(function(queryResult) {
        $scope.products = queryResult;
        ModalProvider.display($scope, ModalProvider.productsModal);
      }).catch(ErrorHandler.$httpTimeout).finally(function() {
        ModalProvider.hideLoading();
      });
    }
    else {
      ModalProvider.display($scope, ModalProvider.productsModal);
    }
  };

  $scope.quoteProducts = [];

  $scope.onSelectProduct = function(product) {
    $scope.productsModal.hide();
    for(var i in $scope.quoteProducts) {
      if($scope.quoteProducts[i] === product) {
        return;
      }
    }
    product.discount = 0;
    product.quantity = 1;
    $scope.quoteProducts.push(product);
  };

  $scope.locationModel = {state: {}, country: {}};

  LocationService.getDistritos(function(queryResult) {
    $scope.distritos = queryResult;
    $scope.locationModel.state = LocationService.findDistritos($scope.locationModel.state);   
  }, $scope.getSessionToken());

  $scope.openStateModal = function() {
    ModalProvider.display($scope, ModalProvider.distritosModal);
  };

  LocationService.getPaises(function(queryResult) {
    $scope.paises = queryResult;
    $scope.locationModel.country = LocationService.findPaises($scope.locationModel.country);
  }, $scope.getSessionToken());

  $scope.openCountryModal = function() {   
    ModalProvider.display($scope, ModalProvider.paisesModal);
  };
}

angular.module('sinforce.quotes').controller('RegisterQuote', registerQuote);