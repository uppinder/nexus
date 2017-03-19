angular.module('nexus').controller('chatRoomController', ['$rootScope', '$scope', '$state', '$location', '$stateParams', '$uibModal', 'chatroom', 'Upload',
	function($rootScope, $scope, $state, $location, $stateParams, $uibModal, chatroom, Upload) {
		
		// console.log($stateParams);
		$rootScope.roomId = $scope.roomId = $stateParams.roomId;
		// $scope.getMessages = chatroom.getMessages;

		$scope.$on('socket:update', function() {
			$scope.$apply();
		});
		
		$scope.avatar_style = {
			'border-radius':'50px'
		};

		// $scope.messages = chatroom.getMessages($scope.roomId);	
		// console.log($scope.messages);

		$scope.getMessages = function() {
			return chatroom.getMessages($scope.roomId);
		}

		$scope.getIsTyping = function() {
			return chatroom.getIsTyping($scope.roomId);
		}

		$scope.getMembers = function() {
			// console.log(chatroom.getMembers($scope.roomId));
			return chatroom.getMembers($scope.roomId);
		}

		$scope.istyping = false;
		$scope.checkText = function(evt) {

			if($scope.m !== "" && !$scope.istyping) {
				chatroom.isTyping($scope.roomId, false);
				console.log("Started typing..");
				$scope.istyping = true;
			}

			if(evt.keyCode == 13 && $scope.istyping) {
				chatroom.stopTyping($scope.roomId, false);
				console.log("Finished typing");
				$scope.sendMsg($scope.m);
				$scope.istyping = false;
			}

			if(evt.keyCode == 8 && $scope.istyping && $scope.m.length == 1) {
				chatroom.stopTyping($scope.roomId, false);
				$scope.istyping = false;
				console.log("Finished typing");
			}

		}
		
		$scope.sendMsg = function(msg) {
			if(!msg)
				return;
			$scope.m = "";
			chatroom.sendMessage(msg, $scope.roomId, false);
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
					// console.log(friends, $rootScope.roomId);
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
	// console.log($scope.persons);
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