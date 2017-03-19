angular.module('nexus').controller('navbarController', ['$scope','$state', 'authService', '$http', '$location', 'chatSocket',
	function($scope, $state, authService, $http, $location, chatSocket) {

		$scope.profilePic = 'https://localhost:4000/public/SkqEWypDx.jpg';
		$scope.firstname = "";
		$scope.username = "";
		$scope.avatar_style = {
			'border-radius':'50px'
		};

		$scope.goToChat = function() {
			$state.transitionTo('main.chat');
		};

		$scope.goToCalendar = function() {
			$state.transitionTo('main.calendar');
		};

		$scope.goToRequests = function(){
			$state.transitionTo('main.requests');
		}
		// // redirect main to the chatrooms list
		// if($state.current.name == 'main')
		// 	$scope.goToChat();


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

angular.module('nexus').controller('searchbarController', 
	function($scope, $http, $state) {
	
		$scope.searchUsers = function(val) {
			return $http.get('/search/all', {params: {key:val}})
					.then(function(res) {
						return res.data.result;
					});
		}

		$scope.onSearchSelect = function($item) {
			$scope.searchResult = "";
			$state.transitionTo('main.user', {id:$item.username});
		}

});