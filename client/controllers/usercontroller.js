angular.module('nexus').controller('userController', ['$scope', '$http', '$location', '$stateParams',
	function($scope, $http, $location, $stateParams) {

		$scope.name = "";
		$scope.profilePic = "";

		function getInfo() {
			return $http.get('/user_data/user/' + $stateParams.id)
					.then(function(res) {
						return res.data.user;
					}, function(res) {
						console.log(res);
					});		
		}

		getInfo()
		.then(function(data) {
			$scope.name = data.username;
			$scope.profilePic = $location.protocol() + '://' + location.host + '/public/' + data.profilePic;
		})
		.catch(function(err) {
			console.log(err);
		});
	}
]);