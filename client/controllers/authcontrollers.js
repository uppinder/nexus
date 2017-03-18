angular.module('nexus').controller('loginController', ['$scope', '$state', 'authService',
	function($scope, $state, authService) {

		$scope.error = false;
		$scope.image = "https://localhost:4000/public/iit.png";
		$scope.login = function() {

			// initial value
			$scope.error = false;

			// user deatils got from the login form
			var userDetails = {
				username: $scope.loginForm.username,
				password: $scope.loginForm.password,
				mailServer: $scope.loginForm.mailServer
			};
			
			// call login from service
			authService.login(userDetails)
				.then(function(user) {
					$scope.loginForm = {};
					if(!user.verified) {
						$state.go('initialInfo');
					} else {
						$state.go('main');
					}
				
				})
				// handle errors
				.catch(function() {
					//Needs better error handling
					$scope.error = true;
					$scope.errorMessage = "Something went wrong!";
				});

		};
	}
]);