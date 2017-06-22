function agendaList(
  $q,
  $scope,
  $state,
  Agenda,
  AgendaConstants,
  AgendaIntegration,
  DefinitionService,
  ErrorHandler,
  ModalProvider,
  PopupProvider,
  $rootScope) {
  $scope.calendar = {};
  $scope.tipos = AgendaConstants.tipos;
  $scope.getStatusDate = AgendaIntegration.getStatusDate;
  $scope.getStatusColor = AgendaIntegration.getStatusColor;
  $scope.getStatusDescription = AgendaIntegration.getStatusDescription;

  $scope.onDelete = function(activityInformation) {
    AgendaIntegration.removeActivity(activityInformation, function(operationResult) {
      if (operationResult) {
        ErrorHandler.js(operationResult);
      }
      $scope.updateCalendar(activityInformation, true);
      $state.go('app.agenda.history');
    });
  };

  $scope.deleteActivity = function(activityId) {
    PopupProvider.confirmCancel().then(function(dialogResult) {
      if (dialogResult) {
        Agenda.remove({
          id: activityId,
          token: $scope.getSessionToken()
        }).$promise.then($scope.onDelete).catch(ErrorHandler.$httpTimeout);
      }
    });
  };

  $scope.updateActivity = function(activityId) {
    $state.go('app.agenda-update', {
      id: activityId,
      profile: false,
      token: $scope.getSessionToken()
    });
  };

  $scope.viewActivity = function(activityId) {
    $state.go('app.agenda-view', {
      id: activityId,
      token: $scope.getSessionToken()
    });
  };

  $scope.refreshAgenda = function(fromLoading) {
    if (fromLoading) {
      ModalProvider.displayLoading();
    }
    $q.all([
      Agenda.query({
        status: true,
        token: $scope.getSessionToken()
      }).$promise,
      Agenda.query({
        status: false,
        token: $scope.getSessionToken()
      }).$promise
    ]).then(function(queryResult) {
      $scope.activities = queryResult[0];
      $scope.history = queryResult[1];
      $scope.calendar.eventSource = [];
      $scope.activities.forEach(function(activityInformation) {
        $scope.calendar.eventSource.push(
          AgendaIntegration.generateEvent(activityInformation)
        );
      });
      $scope.history.forEach(function(activityInformation) {
        if (activityInformation.status !== 1) {
          $scope.calendar.eventSource.push(
            AgendaIntegration.generateEvent(activityInformation)
          );
        }
      });
    }).catch(ErrorHandler.$httpTimeout).finally(function() {
      if (fromLoading) {
        ModalProvider.hideLoading();
      } else {
        $scope.$broadcast('scroll.refreshComplete');
      }
    });
  };

  $scope.isToday = function() {
    var currentDate = new Date();
    var currentCalendar = new Date($scope.calendar.currentDate);
    currentDate.setHours(0, 0, 0, 0);
    currentCalendar.setHours(0, 0, 0, 0);
    return currentDate.getTime() === currentCalendar.getTime();
  };

  $scope.updateCalendar = function(activityInformation, softDelete) {
    var activityFound = false;
    var activityId = activityInformation.id;
    for (var i = 0; i < $scope.activities.length; i++) {
      if ($scope.activities[i].id == activityId) {
        activityFound = true;
        $scope.activities.splice(i, 1);
        if (softDelete) {
          $scope.history.push(activityInformation);
        }
        else {
          $scope.activities.push(activityInformation);
        }
        break;
      }
    }
    if (activityFound) {
      var calendarEvents = $scope.calendar.eventSource;
      for (var j = 0; j < calendarEvents.length; j++) {
        if (calendarEvents[j].id == activityId) {
          $scope.calendar.eventSource.splice(j, 1);
          $scope.calendar.eventSource.push(AgendaIntegration.generateEvent(activityInformation));
          break;
        }
      }
    }
  };

  $scope.changeMode = function(mode) {
    $scope.calendar.mode = mode;
  };

  $scope.showToday = function() {
    $scope.calendar.currentDate = new Date();
  };

  $scope.onViewTitleChanged = function(title) {
    $scope.viewTitle = title;
  };

  $rootScope.$on('agenda:create', function(event, activityInformation) {
    $scope.activities.push(activityInformation);
    $scope.calendar.eventSource.push(AgendaIntegration.generateEvent(activityInformation));
  });

  $rootScope.$on('agenda:delete', function(event, activityInformation) {
    $scope.updateCalendar(activityInformation, true);
  });

  $rootScope.$on('agenda:update', function(event, activityInformation) {
    $scope.updateCalendar(activityInformation, false);
  });

  $scope.refreshAgenda(true);
}

function agendaController(
  $scope,
  $state,
  $ionicHistory,
  $ionicPopup,
  $stateParams,
  activityInformation,
  Agenda,
  AgendaConstants,
  AgendaIntegration,
  EntityFactory,
  DefinitionService,
  ErrorHandler,
  ModalProvider) {
  $scope.origens = AgendaConstants.origens;
  $scope.getPriority = AgendaIntegration.getPriority;

  var updateActivity = !!activityInformation;
  var fromProfile = $stateParams.profile || false;

  var defaultInformation = {
    priority: 1,
    entity: null,
    source: 'C',
    type: 'TEL'
  };

  if (!fromProfile) {
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
      viewData.enableBack = true;
    });
  }

  if (updateActivity) {
    $scope.formTitle = 'EDITAR ATIVIDADE';
    $scope.activityModel = angular.copy(activityInformation);
    if (activityInformation.entity) {
      $scope.activityModel.source = activityInformation.entity.type;
    }
    else {
      $scope.activityModel.source = 'N';
    }
    $scope.activityModel.date = AgendaIntegration.getActivityDate(activityInformation.start);
  } else {
    $scope.formTitle = 'AGENDAR ATIVIDADE';
    $scope.activityModel = defaultInformation;
  }

  $scope.viewTypes = function() {
    ModalProvider.display($scope, ModalProvider.eventModal);
  };

  $scope.viewSources = function() {
    ModalProvider.display($scope, ModalProvider.sourceModal);
  };

  $scope.viewEntities = function() {
    ModalProvider.display($scope, ModalProvider.entityModal);
  };

  $scope.onCreate = function(createdActivity) {
    AgendaIntegration.insertActivity(createdActivity, function(operationResult) {
      if (operationResult) {
        ErrorHandler.js(operationResult);
      }
      $scope.$emit('agenda:create', createdActivity);
      $scope.activityModel = defaultInformation;
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.agenda.list');
    });
  };

  $scope.onUpdate = function(updatedActivity) {
    AgendaIntegration.updateActivity(activityInformation, updatedActivity, function(operationResult) {
      if (operationResult) {
        ErrorHandler.js(operationResult);
      }
      $scope.$emit('agenda:update', updatedActivity);
      if (fromProfile) {
        $ionicHistory.goBack();
      } else {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.agenda.list');
      }
    });
  };

  $scope.validateActivity = function(activityForm) {
    return activityForm.$invalid || !$scope.activityModel.date || !$scope.activityModel.start || !$scope.activityModel.end;
  };

  $scope.saveActivity = function() {
    var activityData = angular.extend(angular.copy($scope.activityModel), {
      type: $scope.activityModel.type.id,
      entity: $scope.activityModel.entity.id,
      end: AgendaIntegration.getActivityEnd($scope.activityModel),
      start: AgendaIntegration.getActivityStart($scope.activityModel)
    });
    delete activityData.date;
    if (updateActivity) {
      Agenda.update({
          id: activityInformation.id,
          token: $scope.getSessionToken()
        }, activityData).$promise
        .then($scope.onUpdate)
        .catch(ErrorHandler.$httpTimeout);
    } else {
      Agenda.save({
          token: $scope.getSessionToken()
        }, activityData).$promise
        .then($scope.onCreate)
        .catch(ErrorHandler.$httpTimeout);
    }
  };

  DefinitionService.getEvents(function(queryResult) {
    $scope.tipos = queryResult;
    if (updateActivity) {
      $scope.activityModel.type = DefinitionService.findEvent($scope.activityModel.type.id);
    } else {
      $scope.activityModel.type = DefinitionService.findEvent($scope.activityModel.type);
    }
  });

  $scope.refreshEntities = function() {
    EntityFactory.getEntities($scope.activityModel.source, function(queryResult) {
      $scope.entities = queryResult;
      if (updateActivity) {
        $scope.activityModel.entity = EntityFactory.findEntity(
          $scope.activityModel.entity ? $scope.activityModel.entity.id : null,
          $scope.activityModel.source
        );
      } else {
        $scope.activityModel.entity = EntityFactory.findEntity(
          $scope.activityModel.entity,
          $scope.activityModel.source
        );
      }
    }, $scope.getSessionToken());
  };

  $scope.refreshEntities();
}

function agendaView(
  $scope,
  $state,
  $ionicHistory,
  $rootScope,
  Agenda,
  AgendaConstants,
  AgendaIntegration,
  ErrorHandler,
  PopupProvider,
  activityInformation) {
  $scope.activity = activityInformation;
  $scope.glyphIcons = AgendaConstants.glyphIcons;
  $scope.getPriority = AgendaIntegration.getPriority;
  $scope.getStatusColor = AgendaIntegration.getStatusColor;
  $scope.getStatusDescription = AgendaIntegration.getStatusDescription;

  $scope.onDelete = function(deletedActivity) {
    AgendaIntegration.deleteActivity(deletedActivity, function(operationResult) {
      if (operationResult) {
        ErrorHandler.js(operationResult);
      }
      $scope.$emit('agenda:delete', deletedActivity);
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.agenda.history');
    });
  };

  $scope.deleteActivity = function() {
    PopupProvider.confirmCancel().then(function(dialogResult) {
      if (dialogResult) {
        Agenda.remove({
          id: $scope.activity.id,
          token: $scope.getSessionToken()
        }).$promise.then($scope.onDelete).catch(ErrorHandler.$httpTimeout);
      }
    });
  };

  $scope.updateActivity = function() {
    $state.go('app.agenda-update', {
      profile: true,
      id: activityInformation.id,
      token: $scope.getSessionToken()
    });
  };

  $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
    viewData.enableBack = true;
  });

  $rootScope.$on('agenda:delete', function(event, activity) {
    $scope.activity = activity;
  });

  $rootScope.$on('agenda:update', function(event, activity) {
    $scope.activity = activity;
  });
}

angular.module('sinforce.agenda')
  .controller('AgendaList', agendaList)
  .controller('AgendaView', agendaView)
  .controller('AgendaController', agendaController);