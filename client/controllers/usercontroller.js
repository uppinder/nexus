angular.module('nexus').controller('userController', ['$scope', '$http', '$location', '$stateParams',
	function($scope, $http, $location, $stateParams) {

		$scope.name = "";
		$scope.profilePic = "";
		$scope.isFriend = false;

		function getInfo() {
			return $http.get('/user_data/user/' + $stateParams.id)
					.then(function(res) {
						return res.data;
					}, function(res) {
						console.log(res);
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
			$scope.name = data.user.username;
			$scope.profilePic = $location.protocol() + '://' + location.host + '/public/' + data.user.profilePic;
			$scope.isFriend = data.isFriend;
		})
		.catch(function(err) {
			console.log(err);
		});

		$scope.addFriend = function() {
			sendFriendReq()
			.then(function() {
				console.log('here');
				$scope.isFriend = true;
				console.log($scope.isFriend);
			})
			.catch(function(err) {
				console.log(err);
			});
		}
	}
]);