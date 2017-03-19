angular.module('nexus').controller('chatController', ['$scope', '$state', '$uibModal', 'chatroom',
	function($scope, $state, $uibModal, chatroom) {
	

		$scope.$on('socket:update', function() {
			$scope.$apply();
		});
		
		$scope.goToPrivate = function() {
			$state.transitionTo('main.chat.private');
			$scope.roomId = null;
		}

		$scope.goToRoom = function(id) {
			console.log(id);
			$state.transitionTo('main.chat.room', {roomId:id});
		}

		$scope.getRooms = function() {
			return chatroom.getRooms();
		}

		// Get new room name
		$scope.newRoom = function() {
			
			var modalInstance = $uibModal.open({
				templateUrl: 'newRoomModal.html',
				controller: 'newRoomModalCtrl'
			});

			modalInstance.result.then(function(name) {
				if(name !== "")
					chatroom.createRoom(name);
			}, function(err) {
				// console.log('Create room modal closed.');
			});
		}
	}
]);

angular.module('nexus').controller('newRoomModalCtrl', function($scope, $uibModalInstance) {

	$scope.ok = function() {
		$uibModalInstance.close($scope.roomName);
	}

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	}
});