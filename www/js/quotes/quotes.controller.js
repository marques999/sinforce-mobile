function quotesController(
  $scope,
  $ionicSlideBoxDelegate,
  ErrorHandler,
  ModalProvider,
  PopupProvider,
  Quotes,
  $state) {

  $scope.normalBar = true;
  $scope.searchVal = {};
  $scope.state = $state;

  $scope.toggleNavigation = function() {
    $scope.normalBar = !$scope.normalBar;
     $scope.searchVal.name = '';
  };

  $scope.$on('$destroy', function() {

  });

   $scope.quoteSearch = function(quote){
    if (!$scope.searchVal.name || (('' + quote.quoteNum).indexOf($scope.searchVal.name) != -1) || (quote.clientName.toLowerCase().indexOf($scope.searchVal.name.toLowerCase()) != -1) ){
        return true;
    }
    return false;
 };

 $scope.next = function() {
   $ionicSlideBoxDelegate.next();
 };

 $scope.previous = function() {
   $ionicSlideBoxDelegate.previous();
 };

  $scope.deleteQuote = function(quoteId) {
    PopupProvider.confirmDelete().then(function(dialogResult) {
      if (dialogResult) {
        Quotes.delete({
          id: quoteId
        }).then(function(operationResult) {
          console.log(operationResult);
        }).catch(ErrorHandler.$httpTimeout);
      }
    });
  };

  $scope.numberOfItemsToDisplay = 10;

  $scope.addMoreItem = function() {
    if ($scope.quotes.length > $scope.numberOfItemsToDisplay)
        $scope.numberOfItemsToDisplay += 10; // load number of more items
        $scope.$broadcast('scroll.infiniteScrollComplete')
  };

  $scope.viewQuote = function(quoteId) {
    $state.go('app.quotes-view', {
      id: quoteId,
      token: $scope.getSessionToken()
    });
  };

  $scope.refreshQuotes = function(fromLoading) {
    if (fromLoading) {
      ModalProvider.displayLoading();
    }
    Quotes.query().$promise.then(function(queryResult) {
      $scope.quotes = queryResult;
      $scope.numberOfItemsToDisplay = 10;
    }).catch(ErrorHandler.$httpTimeout).finally(function() {
      if (fromLoading) {
        ModalProvider.hideLoading();
      } else {
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  };
  $scope.refreshQuotes(true);
}

function updateQuote($scope, quote, ErrorHandler, Quotes) {

  $scope.quoteModel = quote;
  $scope.quoteId = quote.id;
  $scope.formTitle = 'EDITAR ENCOMENDA';

  $scope.saveQuote = function() {
    Quotes.update({
      id: $scope.quoteId
    }, $scope.quoteModel).$promise.then(function(operationResult) {
      console.log(operationResult);
    }).catch(ErrorHandler.$httpTimeout);
  };
}

angular.module('sinforce.quotes')
  .controller('UpdateQuote', updateQuote)
  .controller('QuotesCtrl', quotesController);