angular.module('nexus').controller('chatRoomController', ['$rootScope', '$scope', '$state', '$stateParams', '$uibModal', 'chatroom',
	function($rootScope, $scope, $state, $stateParams, $uibModal, chatroom) {
		
		// console.log($stateParams);
		$rootScope.roomId = $scope.roomId = $stateParams.roomId;
		// $scope.getMessages = chatroom.getMessages;

		$scope.$on('socket:update', function() {
			$scope.$apply();
		});
		
		// $scope.messages = chatroom.getMessages($scope.roomId);	
		// console.log($scope.messages);

		$scope.getMessages = function() {
			return chatroom.getMessages($scope.roomId);
		}

		$scope.sendMsg = function() {
			if(!$scope.m)
				return;

			chatroom.sendMessage($scope.m, $scope.roomId);
			$scope.m = "";
		}

		$scope.viewProfile = function(id) {
			$state.transitionTo('main.user', {id: id});
		}
		
		$scope.addPeople = function() {
			
			var modalInstance = $uibModal.open({
				templateUrl: 'addPeopleModal.html',
				controller: 'addPeopleModalCtrl'
			});

			modalInstance.result.then(function(friends) {
				if(!_.isEmpty(friends)) {
					chatroom.addFriends(friends, $rootScope.roomId);
				}
			}, function(err) {
				// console.log('Create room modal closed.');
			});
		}	
	}
]);

angular.module('nexus').controller('addPeopleModalCtrl', function($scope, $http, $uibModalInstance) {

	$scope.persons = {};

	$scope.searchFriends = function(val) {
		return $http.get('/search/friends', {params: {key:val}})
				.then(function(res) {
					return res.data.result;
					// console.log(res.data.result[0]);
				});
	}

	$scope.onSearchSelect = function($item) {
		$scope.searchResult = "";
		$scope.persons[$item._id] = $item;
	}

	$scope.ok = function() {
		$uibModalInstance.close($scope.persons);
	}

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	}
});