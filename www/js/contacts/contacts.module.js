function contactsRoute($stateProvider) {

  $stateProvider.state('app.contacts', {
    url: '/contacts',
    views: {
      'menuContent': {
        templateUrl: 'templates/contacts.html',
        controller: 'ContactsList'
      }
    }
  }).state('app.contacts-register', {
    url: '/contacts/new',
    resolve: {
      contact: function() {
        return null;
      }
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/contacts/form.html',
        controller: 'ContactsController'
      }
    }
  }).state('app.contacts-update', {
    url: '/contacts/update/:id',
    params: {
      token: null,
      profile: false
    },
    resolve: {
      contact: ['$stateParams', 'Contacts',
        function($stateParams, Contacts) {
          return Contacts.get({
            id: $stateParams.id,
            token: $stateParams.token
          }).$promise;
        }
      ]
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/contacts/form.html',
        controller: 'ContactsController'
      }
    }
  }).state('app.contacts-view', {
    url: '/contacts/:id',
    params: {
      token: null,
    },
    resolve: {
      contact: ['$stateParams', 'Contacts',
        function($stateParams, Contacts) {
          return Contacts.get({
            id: $stateParams.id,
            token: $stateParams.token
          }).$promise;
        }
      ]
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/contacts/view.html',
        controller: 'ContactsView'
      }
    }
  });
}

angular.module('sinforce.contacts', ['chart.js']).config(contactsRoute);