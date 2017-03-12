var app = angular.module('nexus', [
  'ui.router',// for SPA(single page application) 
  'ui.bootstrap',
  'mwl.calendar',
  'ngAnimate',
  'ngSanitize',
  'angular-nicescroll',
  'btford.socket-io',
  'ngFileUpload', 
  'ngImgCrop'
]);

// configuration of the app-module
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  
  $stateProvider
    // main home page (with no controller)
    .state('main', {
      url: '/',
      templateUrl: 'views/main.html',
      params: {
        restricted: true
      }
    })
    // chat
    .state('main.chat', {
      url: '^/chat',
      templateUrl: 'views/chat/chat.html',
      controller: 'chatController',
      params: {
        restricted: true
      }
    })
    // chat ==> chat rooms 
    .state('main.chat.room', {
      url: '^/room/:roomId',
      templateUrl: 'views/chat/chatroom.html',
      controller: 'chatRoomController',
      params: {
        restricted: true
      }
    })
    // user page
    .state('main.user', {
      url: '^/user/:id',
      templateUrl: 'views/user.html',
      controller: 'userController',
      params: {
        restricted: true
      }
    })
    // user agendas list
    .state('main.calendar',{
      url:'^/calendar',
      templateUrl: 'views/calendar/calendar.html',
      controller: 'calendarController',
      params: {
        restricted: true
      }
    })
    // login page
    .state('login',{
      url: '/login',
      templateUrl: 'views/auth/login.html',
      controller: 'loginController',
      params: {
        restricted: false
      }
    })
    // collecting initial info of the user after first sign in 
    .state('initialInfo', {
      url: '/initial',
      templateUrl: 'views/auth/initial.html',
      controller: 'initialInfoController',
      params: {
        restricted: true
      }
    })
    // 404-Not found to be returned
    .state('404', {
      url: '/404',
      templateUrl: 'views/404.html'
    });
    
    // if none of the routes is vaild, then return a 404
    $urlRouterProvider.otherwise('/404');
    $locationProvider.html5Mode(true);
});

app.run(function($location, $rootScope, $state, authService) {
  
  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams) {
      authService.getUserStatus()
        .then(function() {
          if (toState.params && toState.params.restricted && !authService.isLoggedIn()) {
            $state.go('login');
          }
        });
    });
});