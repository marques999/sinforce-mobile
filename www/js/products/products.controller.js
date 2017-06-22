function productsController($scope, $base64, $ionicLoading, $ionicTabsDelegate, ErrorHandler, ModalProvider, Products) {

  $scope.product = null;
  $scope.products = [];
  $scope.productSearch = {};

  $scope.viewProduct = function(productId) {
    if (!$scope.product || $scope.product.id !== productId) {
      ModalProvider.displayLoading();
      Products.get({
        id: $base64.encode(productId),
        token: $scope.getSessionToken()
      }).$promise.then(function(userQuery) {
        $scope.product = userQuery;
        ModalProvider.display($scope, ModalProvider.productModal);
      }).catch(ErrorHandler.$httpTimeout).finally(function() {
        ModalProvider.hideLoading();
      });
    } else {
      ModalProvider.display($scope, ModalProvider.productModal);
    }
  };

  $scope.refreshProducts = function(fromLoading) {
    if (fromLoading) {
      ModalProvider.displayLoading();
    }
    Products.query({
      token: $scope.getSessionToken()
    }).$promise.then(function(userQuery) {
      $scope.products = userQuery;
    }).catch(ErrorHandler.$httpTimeout).finally(function() {
      if (fromLoading) {
        ModalProvider.hideLoading();
      } else {
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  };

  $scope.refreshProducts(true);
}

angular.module('sinforce.products').controller('ProductsController', productsController);