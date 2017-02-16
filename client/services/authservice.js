angular.module('nexus').factory('authService', ['$http',
	function($http) {

		var user = false;

		return {
			isLoggedIn: isLoggedIn,
			getUserStatus: getUserStatus,
			register: register,
			verifyUser: verifyUser,
			login: login,
			logout: logout
		};


		function isLoggedIn() {
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

		function register(formData) {

			return $http.post('/auth/register', formData)
				.then(function() {
						user = true;
					},
					function() {
						user = false;
					});

		}

		function verifyUser(token) {
			return $http.get('/verifyuser/' + token)
				.then(function(res) {
						user = res.data.verified;
						return res;
					}, 
					function(res) {
						user = false;
						return res;
					});
		}

		function login(formData) {

			return $http.post('/auth/login', {
					username: formData.username,
					password: formData.password
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