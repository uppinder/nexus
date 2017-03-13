var app = angular.module('nexus', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'ngSanitize',
    'angular-nicescroll',
    'btford.socket-io',
    'ngFileUpload',
    'ngImgCrop'
]);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('main', {
            url: '/',
            templateUrl: 'views/main.html',
            params: {
                restricted: true
            }
        })
        .state('main.chat', {
            url: '^/chat',
            templateUrl: 'views/chat/chat.html',
            controller: 'chatController',
            params: {
                restricted: true
            }
        })
        .state('main.complaint',{
            url: '^/complaint',
            templateUrl: 'views/complaint.html',
            controller: 'complaintcontroller',
            params: {
                restricted: true
            }
        })
        .state('main.chat.room', {
            url: '^/room/:roomId',
            templateUrl: 'views/chat/chatroom.html',
            controller: 'chatRoomController',
            params: {
                restricted: true
            }
        })
        .state('main.user', {
            url: '^/user/:id',
            templateUrl: 'views/user.html',
            controller: 'userController',
            params: {
                restricted: true
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/auth/login.html',
            controller: 'loginController',
            params: {
                restricted: false
            }
        })
        .state('initialInfo', {
            url: '/initial',
            templateUrl: 'views/auth/initial.html',
            controller: 'initialInfoController',
            params: {
                restricted: true
            }
        })
        .state('404', {
            url: '/404',
            templateUrl: 'views/404.html'
        });

    $urlRouterProvider.otherwise('/404');
    $locationProvider.html5Mode(true);
});

app.run(function ($location, $rootScope, $state, authService) {

    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            authService.getUserStatus()
                .then(function () {
                    if (toState.params && toState.params.restricted && !authService.isLoggedIn()) {
                        $state.go('login');
                    }
                });
        });
});