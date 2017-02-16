angular.module('nexus').controller('navbarController', ['$scope','$state', 'authService', '$http', '$location', 'chatSocket',
	function($scope, $state, authService, $http, $location, chatSocket) {

		$scope.profilePic = 'http://localhost:4000/public/SkqEWypDx.jpg';
		$scope.firstname = "";

		if($state.current.name == 'main')
			$state.go('main.home');

		$scope.logout = function() {
			chatSocket.disconnect();
			authService.logout()
				.then(function() {
					$state.go('login');
				});
		}

		function getData() {
			return $http({
				method: 'GET',
				url: '/user/pic',
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
			// console.log(data.profilePic);
			$scope.profilePic = $location.protocol() + '://' + location.host + '/public/' + data.profilePic;
			// console.log(profilePic);
			$scope.firstname = data.name.firstname;
		})
		.catch(function() {
			console.log("Error.");
		});
	}
]);
	