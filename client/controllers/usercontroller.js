angular.module('nexus').controller('userController', ['$scope', '$http', '$location', '$state', '$stateParams',
	function($scope, $http, $location, $state, $stateParams) {

		$scope.name = "";
		$scope.profilePic = "";
		$scope.isFriend = false;

		function getInfo() {
			return $http.get('/user_data/user/' + $stateParams.id)
					.then(function(res) {
						return res.data;
					}, function(res) {
						return res;
					});		
		}

		function sendFriendReq() {
			return $http.post('/user_data/add', {
					username: $stateParams.id
				})
				.then(function() {					
				}, function(err) {
					console.log(err);
				});
		}

		getInfo()
		.then(function(data) {
			if(data.status == 404)
				$state.go('404');
			else {
				$scope.name = data.user.username;
				$scope.profilePic = $location.protocol() + '://' + location.host + '/public/' + data.user.profilePic;
				$scope.isFriend = data.isFriend;
			}
		})
		.catch(function(err) {
			console.log(err);
		});

		$scope.addFriend = function() {
			sendFriendReq()
			.then(function() {
				$scope.isFriend = true;
			})
			.catch(function(err) {
				console.log(err);
			});
		}
	}
]);