var app = angular.module('nexus', [
  'ui.router',// for SPA(single page application) 
  'ui.bootstrap',
  'mwl.calendar',
  'ngAnimate',
  'ngSanitize',
  'ngMaterial',
  'ngMaterialDatePicker',
  'mdColorPicker',
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
      templateUrl: 'views/f.main.html',
      params: {
        restricted: true
      }
    })
    // chat
    .state('main.chat', {
      url: '^/chat',
      templateUrl: 'views/chat/f.chat.html',
      controller: 'chatController',
      params: {
        restricted: true
      }
    })
    // chat ==> chat rooms 
    .state('main.chat.room', {
      url: '/room/:roomId',
      templateUrl: 'views/chat/f.chatroom.html',
      controller: 'chatRoomController',
      params: {
        restricted: true
      }
    })
    .state('main.chat.private', {
      url:'/p',
      templateUrl:'views/chat/f.private.html',
      controller: 'privateMainController',
      params: {
        restricted: true
      }
    })
    .state('main.chat.private.chat', {
      url: '/:id',
      templateUrl: 'views/chat/f.privatechat.html',
      controller: 'privateChatController',
      restricted: {
        restricted: true
      }
    })
    // user page
    .state('main.user', {
      url: '^/user/:id',
      templateUrl: 'views/f.user.html',
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
    // requests page 
    .state('main.requests',{
      url:'^/requests',
      templateUrl:'views/requests/requests.html',
      controller:'requestsController',
      params:{
        restricted:true
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