angular.module('nexus').controller('chatController', ['$scope', '$rootScope', 'chatroom', 'chatSocket',
	function($scope, $rootScope, chatroom, chatSocket) {
		
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
	}
]);