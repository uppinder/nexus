angular.module('nexus').controller('chatController', ['$scope', '$state', '$rootScope', 'chatroom', 'chatSocket',
	function($scope, $state, $rootScope, chatroom, chatSocket) {
		
		$scope.getMessages = chatroom.getMessages;
		
		$scope.$on('socket:update', function() {
			$scope.apply();
		});
		
		$scope.sendMsg = function() {
			if(!$scope.m)
				return;
			var msg = $scope.m;

			chatroom.sendMessage(msg);
			$scope.m = "";
		}

		$scope.viewProfile = function(id) {
			$state.go('main.user', {id: id});
		}
	}
]);