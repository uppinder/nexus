angular.module('nexus').controller('privateMainController', ['$scope', '$rootScope', '$state', 'chatroom', 
	function($scope, $rootScope, $state, chatroom) {	

		$scope.$on('socket:update', function() {
			$scope.$apply();
		});

		$scope.getFriends = function() {
			var friends = chatroom.getFriends();
			$scope.me = chatroom.getMe();

			_.forEach(friends, function(friend, key) {
				console.log(friend.members);
				if(friend.members[0].user.username == $scope.me.name)
					friend.name = friend.members[1].user.username;
				else
					friend.name = friend.members[0].user.username;
			});

			return friends;
		}

		$scope.goToChat = function(id) {
			$state.transitionTo('main.chat.private.chat', {id:id});
		}

	}	
]);

angular.module('nexus').controller('privateChatController', ['$scope', '$stateParams', 'chatroom', 'Upload', '$location', 'Peer',
	function($scope, $stateParams, chatroom, Upload, $location, Peer) {	

		$scope.roomId = $stateParams.id;		
		$scope.$on('socket:update', function() {
			$scope.$apply();
		});

		$scope.getPrivateMessages = function() {
			return chatroom.getPrivateMessages($scope.roomId);
		}

		$scope.getPrivateRoomName = function() {
			return chatroom.getPrivateRoomName($scope.roomId);
		}

		$scope.checkText = function(evt) {
			if(evt.charCode == 13) {
				$scope.sendMsg($scope.m);
			}
		}

		$scope.sendMsg = function(msg) {
			if(!msg)
				return;
			$scope.m = "";
			chatroom.sendMessage(msg, $scope.roomId, true);
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
		
	}	
]);
