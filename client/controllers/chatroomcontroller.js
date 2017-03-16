angular.module('nexus').controller('chatRoomController', ['$rootScope', '$scope', '$state', '$location', '$stateParams', '$uibModal', 'chatroom', 'Upload',
	function($rootScope, $scope, $state, $location, $stateParams, $uibModal, chatroom, Upload) {
		
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

		$scope.getMembers = function() {
			// console.log($scope.roomId);
			// console.log(chatroom.getMembers($scope.roomId));
			return chatroom.getMembers($scope.roomId);
		}

		$scope.sendMsg = function(msg) {
			if(!msg)
				return;

			chatroom.sendMessage(msg, $scope.roomId);
			$scope.m = "";
		}

		$scope.viewProfile = function(id) {
			$state.transitionTo('main.user', {id: id});
		}

		$scope.upload = function(file) {
			console.log(file);
			Upload.upload({
				url: 'upload/file',
				data: {
					file: file
				}
			}).then(function(res) {
				var fileUrl = $location.protocol() + '://' + location.host + '/d/' + res.data.fileName;
				console.log(fileUrl);
				var msg = '<a target="_blank" href="' + fileUrl +'">' + file.name + '</a>';
				$scope.sendMsg(msg);

			}, function(err) {
				console.log(err);
			});
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
	console.log($scope.persons);
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