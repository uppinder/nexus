angular.module('nexus').controller('loginController', ['$scope', '$state', 'authService',
	function($scope, $state, authService) {

		$scope.error = false;

		$scope.login = function() {

			var userDetails = {
				username: $scope.loginForm.username,
				password: $scope.loginForm.password,
				mailServer: $scope.loginForm.mailServer
			};


			authService.login(userDetails)
				.then(function(user) {
					$scope.loginForm = {};
					
					if(!user.verified) {
						$state.go('initialInfo');
					} else {
						$state.go('main');
					}
				
				})
				.catch(function() {
					//Needs better error handling
					$scope.error = true;
					$scope.errorMessage = "Something went wrong!";
				});

		};
	}
]);