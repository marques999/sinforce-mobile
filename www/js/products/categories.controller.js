function categoriesController($scope, Categories, ErrorHandler, ModalProvider) {

  $scope.categories = [];
  $scope.categorySearch = {};

  $scope.refreshCategories = function(fromLoading) {
    if (fromLoading) {
      ModalProvider.displayLoading();
    }
    Categories.query({
      token: $scope.getSessionToken()
    }).$promise.then(function(userQuery) {
      $scope.categories = userQuery;
    }).catch(ErrorHandler.$httpTimeout).finally(function() {
      if (fromLoading) {
        ModalProvider.hideLoading();
      } else {
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  };

  $scope.refreshCategories(true);
}

function categoriesView($scope, $stateParams, categoryInformation, Categories, ErrorHandler) {

  $scope.userSearch = {};
  $scope.category = categoryInformation;

  $scope.refreshCategory = function() {
    return Categories.get({
      id: $stateParams.id,
      token: $scope.getSessionToken()
    }).$promise.then(function(userQuery) {
      $scope.category = userQuery;
    }).catch(ErrorHandler.$httpTimeout).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
}

angular.module('sinforce.products')
  .controller('CategoriesView', categoriesView)
  .controller('CategoriesController', categoriesController);