angular.module('nexus').controller('navbarController', ['$scope','$state', 'authService', '$http', '$location', 'chatSocket',
	function($scope, $state, authService, $http, $location, chatSocket) {

		$scope.profilePic = 'https://localhost:4000/public/SkqEWypDx.jpg';
		$scope.firstname = "";
		$scope.username = "";

		// redirect main to the chatrooms list
		if($state.current.name == 'main')
			$state.go('main.chat');

		$scope.logout = function() {
			chatSocket.disconnect();
			authService.logout()
				.then(function() {
					$state.go('login');
				});
		}

		$scope.searchUsers = function(val) {
			return $http.get('/search/all', {params: {key:val}})
					.then(function(res) {
						return res.data.result;
						// console.log(res.data.result[0]);
					});
		}

		$scope.onSearchSelect = function($item) {
			$state.go('main.user', {id:$item.username});
		}

		function getData() {
			return $http({
				method: 'GET',
				url: '/user_data/pic',
				cache: true
			})
			.then(function(res) {
				return res.data;
			}, function() {
				console.log("Couldn't load pic!");
			});
		}

		getData()
		.then(function(data) {
			$scope.profilePic = $location.protocol() + '://' + location.host + '/public/' + data.profilePic;
			$scope.firstname = data.name.firstname + " " + data.name.lastname ;
			$scope.username = data.username;
		})
		.catch(function(err) {
			console.log(err);
		});

	}
]);