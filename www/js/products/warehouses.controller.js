function warehousesController($scope, ErrorHandler, ModalProvider, Warehouses) {

  $scope.warehouse = null;
  $scope.warehouses = [];
  $scope.warehouseSearch = {};

  $scope.refreshWarehouses = function(fromLoading) {
    if (fromLoading) {
      ModalProvider.displayLoading();
    }
    Warehouses.query({
      token: $scope.getSessionToken()
    }).$promise.then(function(userQuery) {
      $scope.warehouses = userQuery;
    }).catch(ErrorHandler.$httpTimeout).finally(function() {
      if (fromLoading) {
        ModalProvider.hideLoading();
      } else {
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  };

  $scope.viewWarehouse = function(warehouseId) {
    if ($scope.warehouse === null || $scope.warehouse.id != warehouseId) {
      ModalProvider.displayLoading();
      Warehouses.get({
        id: warehouseId,
        token: $scope.getSessionToken()
      }).$promise.then(function(userQuery) {
        $scope.warehouse = userQuery;
        ModalProvider.display($scope, ModalProvider.warehouseModal);
      }).catch(ErrorHandler.$httpTimeout).finally(function() {
        ModalProvider.hideLoading();
      });
    } else {
      ModalProvider.display($scope, ModalProvider.warehouseModal);
    }
  };

  $scope.refreshWarehouses(true);
}

angular.module('sinforce.products').controller('WarehousesController', warehousesController);