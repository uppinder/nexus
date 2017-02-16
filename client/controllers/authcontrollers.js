angular.module('nexus').controller('loginController', ['$scope', '$state', 'authService',
	function($scope, $state, authService) {

		$scope.error = false;

		$scope.login = function() {

			var userDetails = {
				username: $scope.loginForm.username,
				password: $scope.loginForm.password
			};


			authService.login(userDetails)
				.then(function(user) {
					$scope.loginForm = {};
					
					if(!user.verified) {
						$scope.error = true;
						$scope.errorMessage = 'Please verify your account via webmail.';
					} else
						$state.go('main');
				
				})
				.catch(function() {
					//Needs better error handling
					$scope.error = true;
					$scope.errorMessage = "Something went wrong!";
				});

		};

		$scope.toSignup = function() {
			$state.go('signup');
		};
	}
]);

angular.module('nexus').controller('signupController', ['$scope', '$state', 'authService',
	function($scope, $state, authService) {

		$scope.error = false;

		$scope.register = function() {

			var formData = {
				username: $scope.registerForm.webmail,
				password: $scope.registerForm.password,
				firstname: $scope.registerForm.firstname,
				lastname: $scope.registerForm.lastname,
				gender: $scope.registerForm.gender
			}

			authService.register(formData)
				.then(function() {
					//Needs better handling.
					$scope.registerForm = {};
					$scope.error = true;
					$scope.errorMessage = 'Check your webmail for verification mail';
				})﻿
				.catch(function() {
					//Needs better error handling
					$scope.error = true;
					$scope.errorMessage = "Something went wrong!";
				});
		};

	}
]);

angular.module('nexus').controller('verifyController', ['$scope', '$state', '$stateParams', '$timeout', 'authService', 
	function($scope, $state, $stateParams, $timeout, authService) {
		authService.verifyUser($stateParams.token)
			.then(function(res){
				if(res.status == 200) {
				
					$scope.message = true;
					$timeout(function() {
						$state.go('initialInfo');
					}, 3000);
				
				} else {
					$state.go('404');
				}
			})	
			.catch(function(res) {
				$scope.error = true;
				$scope.errorMessage = "Something went wrong!";
			});
	}
]);