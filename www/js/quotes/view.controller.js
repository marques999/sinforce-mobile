function quotesView(
  $scope,
  $state,
  $ionicHistory,
  $rootScope,
  quote,
  Quotes,
  ErrorHandler,
  PopupProvider) {
  $scope.quote = quote;

  $scope.deleteQuote = function() {
    PopupProvider.confirmDelete().then(function(dialogResult) {
      if (dialogResult) {
        Quotes.delete({
          token: $scope.getSessionToken(),
          id: quote.numDoc
        }).$promise.then(function(quoteInformation) {
          $scope.$emit('quote:delete', quoteInformation);
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.quotes.list');
        }).catch(ErrorHandler.$httpTimeout);
      }
    });
  };

  $scope.roundDouble = function(double) {
    return Math.round(double * 100) / 100;
  };

  $scope.viewCostumer = function(customerId) {
    $state.go('app.customers-view', {
      id: customerId,
      token: $scope.getSessionToken()
    });
  };


  $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
    viewData.enableBack = true;
  });

  $rootScope.$on('quote:update', function(event, quoteInformation) {
    $scope.quote = quoteInformation;
  });
}
angular.module('sinforce.customers').controller('QuotesView', quotesView);