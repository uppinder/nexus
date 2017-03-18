angular.module('nexus').controller('requestsController', ['$scope', '$http', '$location', '$state', '$stateParams',
	function($scope, $http, $location, $state, $stateParams) {
		
		$scope.requests = []

		function requests(){
			return $http.get('/user_data/requests/')
					.then(function(res){
						console.log(res.data);
						return res.data;
					}, function(res){
						return res;
					});
		}


		requests()
		.then(function(data){
			console.log(data);
			$scope.requests = data;
		})
		.catch(function(err){
			console.log(err);
		})

		$scope.getRequests = function(){
			return requests;
		}

	}
]);