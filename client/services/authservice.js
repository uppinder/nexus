angular.module('nexus').factory('authService', ['$http',
	function($http) {

		var user = false;

		return {
			isLoggedIn: isLoggedIn,
			getUserStatus: getUserStatus,
			login: login,
			logout: logout
		};

		function isLoggedIn() { // returns true if a user is logged in
			return user;
		}

		function getUserStatus() {
			return $http.get('/auth/status')
				.then(function(res) {
					user = res.data.status;
				}, function(res) {
					user = false;
				});
		}

		function login(formData) {
			formData.mailServer += '.iitg.ernet.in';
			return $http.post('/auth/login', {
					username: formData.username,
					password: formData.password,
					mailServer: formData.mailServer
				})
				.then(function(res) {
					user = true;
					return res.data;
				}, function() {
					user = false;
				});

		}

		function logout() {
			return $http.get('/auth/logout')
					.then(function() {
						user = false;
					}, function(err) {
						console.log(err);
					});
		}
	}
]);