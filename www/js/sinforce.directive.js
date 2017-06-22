angular.module('sinforce').directive('swipeTabs', ['$ionicGesture', function ($ionicGesture) {
  return {
    restrict: 'A',
    require: 'ionTabs',
    link: function (scope, elm, attrs, tabsCtrl) {
      var onSwipeLeft = function () {
        var target = tabsCtrl.selectedIndex() + 1;
        if (target < tabsCtrl.tabs.length) {
          scope.$apply(tabsCtrl.select(target));
        }
      };
      var onSwipeRight = function () {
        var target = tabsCtrl.selectedIndex() - 1;
        if (target >= 0) {
          scope.$apply(tabsCtrl.select(target));
        }
      };
      var swipeGesture = $ionicGesture.on('swipeleft', onSwipeLeft, elm).on('swiperight', onSwipeRight);
      scope.$on('$destroy', function () {
        $ionicGesture.off(swipeGesture, 'swipeleft', onSwipeLeft);
        $ionicGesture.off(swipeGesture, 'swiperight', onSwipeRight);
      });
    }
  };
}]).directive('expandingText', function () {
  return {
    restrict: 'A',
    controller: function ($scope, $element, $attrs, $timeout) {
      $element.css('min-height', '0');
      $element.css('resize', 'none');
      $element.css('overflow-y', 'hidden');
      function setHeight(height) {
        $element.css('height', height + 'px');
        $element.css('max-height', height + 'px');
      }
      function setHeightToScrollHeight() {
        setHeight(0);
        var scrollHeight = angular.element($element)[0].scrollHeight;
        if (scrollHeight !== undefined) {
          setHeight(scrollHeight);
        }
      }
      setHeight(0);
      $timeout(setHeightToScrollHeight);
      $scope.$watch(function () {
        return angular.element($element)[0].value;
      }, setHeightToScrollHeight);
    }
  };
});