angular.module('nexus').controller('userController', ['$scope', '$http', '$location', '$state', '$stateParams', 
	function($scope, $http, $location, $state, $stateParams) {

		$scope.name = "";
		$scope.username = "";
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
					console.log($scope);
					console.log($stateParams);
					// console.log(user);
					// if(user.verified){
					// }					
				}, function(err) {
					console.log(err);
				});
		}

		getInfo()
		.then(function(data) {
			if(data.status == 404)
				$state.go('404');
			else {
				// console.log(data);
				$scope.name = data.user.name.firstname + " " + data.user.name.lastname;
				$scope.username = data.user.username;
				$scope.profilePic = $location.protocol() + '://' + location.host + '/public/' + data.user.profilePic;
				$scope.isFriend = data.isFriend;
				$scope.program = data.user.program;
				$scope.branch = data.user.branch;
				$scope.rollno = data.user.rollNo;
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