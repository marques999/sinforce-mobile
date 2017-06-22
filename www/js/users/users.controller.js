function userController(
  $scope,
  $state,
  $stateParams,
  $ionicHistory,
  ErrorHandler,
  ModalProvider,
  Users) {

  function redirectView(destinationState) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go(destinationState);
  }

  $scope.updateRepresentative = !!$stateParams.update;

  if ($scope.updateRepresentative) {
    if (!$scope.session) {
      redirectView('app.login');
      return;
    }
  } else if ($scope.session) {
    redirectView('app.users-profile');
    return;
  }

  if ($scope.updateRepresentative) {
    $scope.userModel = {
      representative: $scope.session.representative
    };
    $scope.formTitle = 'EDITAR PERFIL';
  } else {
    $scope.userModel = {};
    $scope.formTitle = 'REGISTAR VENDEDOR';
  }

  function registerUser(formData) {
    Users.save(formData).$promise.then(function(operationResult) {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $scope.session = operationResult;
      $state.go('app.login');
    }).catch(ErrorHandler.$httpTimeout);
  }

  function updateUser(formData) {
    Users.update({
      id: $scope.session.username,
      token: $scope.getSessionToken()
    }, formData).$promise.then(function(operationResult) {
      $scope.session = operationResult;
      $ionicHistory.backView().go();
    }).catch(ErrorHandler.$httpTimeout);
  }

  $scope.submit = function() {
    var formData = angular.copy($scope.userModel);
    delete formData.confirm;
    formData.representative = formData.representative.id;
    if ($scope.updateRepresentative) {
      updateUser(formData);
    } else {
      registerUser(formData);
    }
  };

  $scope.viewRepresentatives = function() {
    ModalProvider.display($scope, ModalProvider.representativeModal);
  };

  Users.query().$promise.then(function(queryResult) {
    $scope.representatives = queryResult;
    $scope.userModel.representative = queryResult[0];
  }).catch(ErrorHandler.$httpTimeout);
}

angular.module('sinforce.users').controller('UserController', userController);