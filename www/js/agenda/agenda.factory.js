function agendaIntegration($cordovaCalendar, $ionicPopup, AgendaConstants) {

  var statusDescription = {
    cancelled: 'Cancelada',
    pending: 'Pendente',
    ongoing: 'Em curso',
    finished: 'Terminada'
  };

  var statusColor = {
    cancelled: 'assertive',
    pending: 'dark',
    ongoing: 'positive',
    finished: 'balanced'
  };

  var statusDate = {
    cancelled: 'dateModified',
    pending: 'start',
    ongoing: 'start',
    finished: 'end'
  };

  function generateEvent(activity) {
    return {
      id: activity.id,
      allDay: false,
      title: activity.name,
      endTime: new Date(activity.end),
      startTime: new Date(activity.start)
    };
  }

  function concatenateTime(baseTime, additionalTime) {
    var activityStart = new Date(baseTime);
    var activityTime = new Date(additionalTime);
    activityStart.setHours(activityStart.getHours() + activityTime.getHours());
    activityStart.setMinutes(activityStart.getMinutes() + activityTime.getMinutes());
    return activityStart.toISOString();
  }

  function getActivityDate(activityStart) {
    if (angular.isDefined(activityStart) && activityStart !== null) {
      var activityDate = new Date(activityStart);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate;
    }
    return null;
  }

  function getActivityStart(activityInformation) {
    if (angular.isDefined(activityInformation.start) && activityInformation.start !== null) {
      return concatenateTime(activityInformation.date, activityInformation.start);
    }
    return null;
  }

  function getActivityEnd(activityInformation) {
    if (angular.isDefined(activityInformation.end) && activityInformation.end !== null) {
      return concatenateTime(activityInformation.date, activityInformation.end);
    }
    return null;
  }

  function getStatus(activityInformation) {
    var currentDate = new Date();
    var activityStart = new Date(activityInformation.start);
    var activityEnd = new Date(activityInformation.end);
    if (activityInformation.status === 1) {
      return 'cancelled';
    }
    if (activityStart > currentDate) {
      return 'pending';
    }
    if (activityStart < currentDate && activityEnd > currentDate) {
      return 'ongoing';
    }
    return 'finished';
  }

  function getStatusDate(activityInformation) {
    var activityStatus = getStatus(activityInformation);
    if (angular.isDefined(statusDate[activityStatus])) {
      return activityInformation[statusDate[activityStatus]];
    }
    return activityInformation.start;
  }

  function getStatusDescription(activityInformation) {
    var activityStatus = getStatus(activityInformation);
    return angular.isDefined(statusDescription[activityStatus]) ? statusDescription[activityStatus] : 'Terminada';
  }

  function getStatusColor(activityInformation) {
    var activityStatus = getStatus(activityInformation);
    return angular.isDefined(statusColor[activityStatus]) ? statusColor[activityStatus] : 'badge-dark';
  }

  function getType(activityInformation) {
    return '[' + activityInformation.type.name + '] ';
  }

  function getPriority(activityInformation) {
    return AgendaConstants.prioridades[activityInformation.priority];
  }

  function showPopup(popupMessage, popupTemplate) {
    return $ionicPopup.confirm({
      okText: 'Sim',
      cancelText: 'Não',
      title: popupMessage,
      template: popupTemplate
    });
  }

  function askInsert() {
    return showPopup('Adicionar atividade', 'Deseja adicionar esta atividade na agenda do seu telemóvel?');
  }

  function askDelete() {
    return showPopup('Apagar atividade', 'Deseja também remover esta atividade da agenda do seu telemóvel?');
  }

  function askUpdate() {
    return showPopup('Atualizar atividade', 'Deseja atualizar a atividade existente na agenda do seu telemóvel?');
  }

  function findActivity(activityInformation) {
    return $cordovaCalendar.findEvent({
      title: getType(activityInformation) + activityInformation.name,
      location: activityInformation.location,
      notes: activityInformation.description,
      startDate: activityInformation.start,
      endDate: activityInformation.end
    });
  }

  function cordovaDelete(activityInformation) {
    return $cordovaCalendar.deleteEvent({
      title: getType(activityInformation) + activityInformation.name,
      location: activityInformation.location,
      notes: activityInformation.description,
      startDate: activityInformation.start,
      endDate: activityInformation.end
    });
  }

  function saveActivity(activityInformation) {
    return $cordovaCalendar.createEventWithOptions({
      title: getType(activityInformation) + activityInformation.name,
      location: activityInformation.location,
      notes: activityInformation.description,
      startDate: activityInformation.start,
      endDate: activityInformation.end
    });
  }

  function insertActivity(activityInformation, userCallback) {
    if (window.plugins && window.plugins.calendar) {
      askInsert().then(function(operationResult) {
        if (operationResult) {
          saveActivity(activityInformation).then(function() {
            userCallback(null);
          }, function() {
            userCallback('An error has occured while creating the current activity!');
          });
        }
        else {
          userCallback(null);
        }
      });
    }
    else {
      userCallback(null);
    }
  }

  function updateActivity(oldInformation, newInformation, userCallback) {
    if (window.plugins && window.plugins.calendar) {
      return findActivity(oldInformation).then(function (activityList) {
        if (activityList) {
          askUpdate().then(function (operationResult) {
            if (operationResult) {
              return cordovaDelete(oldInformation).then(function() {
                return saveActivity(newInformation).then(function() {
                  userCallback(null);
                }, function() {
                  userCallback('An error has occured while creating the current activity!');
                });
              }, function() {
                userCallback('An error has occured while deleting the current activity!');
              });
            }
            else {
              userCallback(null);
            }
          });
        } else {
          askInsert().then(function(operationResult) {
            if (operationResult) {
              return saveActivity(newInformation).then(
                function() {
                  userCallback(null);
                },
                function() {
                  userCallback('An error has occured while creating the current activity!');
                }
              );
            }
            else {
              userCallback(null);
            }
          });
        }
      }, function() {
        userCallback('An error has occured while looking for the current activity!');
      });
    } else {
      userCallback(null);
    }
  }

  function deleteActivity(activityInformation, userCallback) {
    if (window.plugins && window.plugins.calendar) {
      return findActivity(activityInformation).then(function(dialogResult) {
        if (dialogResult) {
          askDelete().then(function(dialogResult) {
            if (dialogResult) {
              return cordovaDelete(activityInformation).then(function() {
                userCallback(null);
              }, function() {
                userCallback('An error has occured while deleting the current activity!');
              });
            } else {
              userCallback(null);
            }
          });
        }
        else {
          userCallback(null);
        }
      }, function () {
        userCallback('An error has occured while looking for the current activity!');
      });
    }
    else {
      userCallback(null);
    }
  }

  return {
    getPriority: getPriority,
    findActivity: findActivity,
    generateEvent: generateEvent,
    getStatusDate: getStatusDate,
    getStatusColor: getStatusColor,
    getActivityEnd: getActivityEnd,
    insertActivity: insertActivity,
    updateActivity: updateActivity,
    deleteActivity: deleteActivity,
    getActivityDate: getActivityDate,
    getActivityStart: getActivityStart,
    getStatusDescription: getStatusDescription
  };
}

angular.module('sinforce.agenda').factory('AgendaIntegration', agendaIntegration);