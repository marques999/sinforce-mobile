function contactIntegration($filter, $cordovaContacts, $ionicPopup) {

  var testObject = {
    id: 13,
    rawId: 17,
    displayName: 'Diogo Marques',
    name: {
      familyName: 'Marques',
      givenName: 'Diogo'
    },
    nickname: null,
    phoneNumbers: [{
      value: '123456879',
      type: 'home'
    }, {
      value: '967867076',
      type: 'mobile'
    }, {
      value: '987654321',
      type: 'work'
    }],
    emails: [{
      value: 'xmarques999@hotmail.com',
      type: 'home'
    }, {
      value: 'up201305642@fe.up.pt',
      type: 'work'
    }, {
      value: 'marques999@gmail.com',
      type: 'home'
    }],
    addresses: [{
      streetAddress: 'Rua da Costa nº 176'
    }],
    ims: null,
    organizations: null,
    birthday: null,
    urls: null
  };

  var getNumber = $filter('parseInt');

  function findMobile(operationResult) {
    var phoneNumbers = operationResult.phoneNumbers;
    if (angular.isArray(phoneNumbers) === false || phoneNumbers.length < 1) {
      return null;
    }
    var mobilePhones = phoneNumbers.filter(function(phoneNumber) {
      return phoneNumber.type == 'mobile';
    });
    if (mobilePhones.length > 0) {
      return getNumber(mobilePhones[0].value);
    }
    return null;
  }

  function findPhone(operationResult, resultIndex) {
    var phoneNumbers = operationResult.phoneNumbers;
    if (angular.isArray(phoneNumbers) === false || phoneNumbers.length < 1) {
      return null;
    }
    var workPhones = phoneNumbers.filter(function(phoneNumber) {
      return phoneNumber.type == 'work';
    });
    if (resultIndex < workPhones.length) {
      return getNumber(workPhones[resultIndex].value);
    }
    var homePhones = phoneNumbers.filter(function(phoneNumber) {
      return phoneNumber.type == 'home';
    });
    var minimumIndex = resultIndex - workPhones.length;
    if (minimumIndex >= 0 && minimumIndex < homePhones.length) {
      return getNumber(homePhones[minimumIndex].value);
    }
    return null;
  }

  function findAddress(contactInformation) {
    var contactAddresses = contactInformation.addresses;
    if (angular.isArray(contactAddresses) === false || contactAddresses.length < 1) {
      return null;
    }
    var workAddresses = contactAddresses.filter(function(address) {
      return address.type == 'work';
    });
    if (workAddresses.length > 0) {
      return workAddresses[0].streetAddress;
    }
    return contactAddresses[0].streetAddress;
  }

  function findEmail(contactInformation) {
    var contactEmails = contactInformation.emails;
    if (angular.isArray(contactEmails) === false || contactEmails.length < 1) {
      return null;
    }
    var workEmails = contactEmails.filter(function(userEmail) {
      return userEmail.type == 'work';
    });
    if (workEmails.length > 0) {
      return workEmails[0].value;
    }
    return contactEmails[0].value;
  }

  function pickContact(userCallback) {
    if (navigator && navigator.contacts) {
      $cordovaContacts.pickContact().then(function(operationResult) {
        userCallback({
          mobile: findMobile(operationResult),
          phone: findPhone(operationResult, 0),
          phone2: findPhone(operationResult, 1),
          name: operationResult.displayName,
          email: findEmail(operationResult),
          address: findAddress(operationResult)
        });
      });
    } else {
      userCallback({
        mobile: findMobile(testObject),
        phone: findPhone(testObject, 0),
        phone2: findPhone(testObject, 1),
        name: testObject.displayName,
        email: findEmail(testObject),
        address: findAddress(testObject)
      });
    }
  }

  function showPopup(popupMessage, popupTemplate) {
    return $ionicPopup.confirm({
      okText: 'Sim',
      cancelText: 'Não',
      title: popupMessage,
      template: popupTemplate
    });
  }

  function showConfirm() {
    return showPopup('Adicionar contacto', 'Deseja adicionar esta entidade à lista de contactos do seu telemóvel?');
  }

  function askDelete() {
    return showPopup('Apagar contacto', 'Deseja também remover esta entidade da lista de contactos do seu telemóvel?');
  }

  function askUpdate() {
    return showPopup('Atualizar contacto', 'Deseja atualizar a entidade existente na lista de contactos do seu telemóvel?');
  }

  function saveContact(contactInformation) {
    return $cordovaContacts.save({
      displayName: contactInformation.name,
      nickname: contactInformation.name,
      phoneNumbers: [{
        type: 'mobile',
        value: contactInformation.mobile
      }, {
        type: 'work',
        value: contactInformation.phone
      }, {
        type: 'home',
        value: contactInformation.phone2
      }],
      addresses: [{
        type: 'work',
        streetAddress: contactInformation.location.address,
        locality: contactInformation.location.parish,
        region: contactInformation.location.state,
        country: contactInformation.location.country,
        postalCode: contactInformation.location.postal
      }],
      emails: [{
        type: 'work',
        value: contactInformation.email
      }]
    });
  }

  function insertContact(contactInformation, userCallback) {
    if (navigator && navigator.contacts) {
      showConfirm().then(function(operationResult) {
        if (operationResult) {
          return saveContact(contactInformation).then(function() {
            userCallback(null);
          }, function() {
            userCallback('An error has occured while inserting contact data!');
          });
        } else {
          userCallback(null);
        }
      });
    } else {
      userCallback(null);
    }
  }

  function removeContact(contactInformation, userCallback) {
    if (navigator && navigator.contacts) {
      return $cordovaContacts.find({
        filter: contactInformation,
        fields: ['displayName']
      }).then(function(contactList) {
        if (contactList.length > 0) {
          askDelete().then(function(operationResult) {
            if (operationResult) {
              return $cordovaContacts.remove(contactList[0]).then(function() {
                userCallback(null);
              }, function() {
                userCallback('An error has occured while deleting contact data!');
              });
            } else {
              userCallback(null);
            }
          });
        } else {
          userCallback(null);
        }
      });
    } else {
      userCallback(null);
    }
  }

  function updateContact(previousName, contactInformation, userCallback) {
    if (navigator && navigator.contacts) {
      return $cordovaContacts.find({
        filter: previousName,
        fields: ['displayName']
      }).then(function(contactList) {
        if (contactList.length > 0) {
          askUpdate().then(function(operationResult) {
            if (operationResult) {
              return $cordovaContacts.remove(contactList[0]).then(function() {
                return saveContact(contactInformation).then(function() {
                  userCallback(null);
                }, function() {
                  userCallback('An error has occured while inserting contact data!');
                });
              }, function() {
                userCallback('An error has occured while deleting contact data!');
              });
            } else {
              userCallback(null);
            }
          });
        } else {
          showConfirm().then(function(operationResult) {
            if (operationResult) {
              saveContact(contactInformation).then(function() {
                userCallback(null);
              }, function() {
                userCallback('An error has occured while inserting contact data!');
              });
            } else {
              userCallback(null);
            }
          });
        }
      });
    } else {
      userCallback(null);
    }
  }

  return {
    pickContact: pickContact,
    insertContact: insertContact,
    removeContact: removeContact,
    updateContact: updateContact
  };
}

angular.module('sinforce').factory('ContactIntegration', contactIntegration);