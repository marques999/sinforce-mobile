function loginController($scope, $state, Auth, ErrorHandler, ModalProvider, $ionicHistory, $ionicPopup, $ionicLoading) {

  $scope.loginData = {};

  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    ModalProvider.displayLoading();
  });

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $ionicLoading.hide();
  });

  $scope.getSessionToken = function() {
    return $scope.session ? $scope.session.token : 1;
  }

  $scope.actionLogout = function() {
    if ($scope.session) {
      Auth.logout({
          id: $scope.session.id,
          token: $scope.session.token
        }).$promise
        .then(function() {
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $scope.loginData = {};
          delete $scope.session;
          $state.go('app.login');
        })
        .catch(function() {
          $ionicPopup.alert({
            title: 'Authentication Error',
            template: 'A tentativa de terminar a sessão do utilizador falhou!'
          });
        });
    }
  };

  $scope.authenticateUser = function() {
    $ionicLoading.show({
      template: '<p>Por favor aguarde...</p><ion-spinner></ion-spinner>'
    });
    Auth.login({}, $scope.loginData).$promise
      .then(function(operationResult) {
        $scope.session = operationResult;
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.users-profile');
      })
      .catch(function() {
        $ionicPopup.alert({
          title: 'Authentication Error',
          template: 'Utilizador ou password não reconhecidos!'
        });
      })
      .finally(function() {
        $scope.loginData = {};
        $ionicLoading.hide();
      });
  };
}

angular.module('sinforce.login').controller('LoginCtrl', loginController);