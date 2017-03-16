angular.module('nexus').controller('initialInfoController', ['$scope', '$state','$http', 'Upload',	 
	function($scope, $state, $http, Upload) {
		
		$scope.nextButton = false;
		$scope.upload = function(dataUrl, name) {
			Upload.upload({
				url:'upload/profilepic',	
				data: {
					file: Upload.dataUrltoBlob(dataUrl, name)
				}
			}).then(function(res) {
				console.log(res);
				$scope.result = res.data; // showing success message on pic upload
				$http.post('/auth/new', {
					firstname: $scope.firstName,
					lastname: $scope.lastName,
					gender: $scope.gender
				}).then( function() {
					$scope.nextButton = true;
				}, function() {
					console.log("error");
				})
			}, function(res) {
				 if (res.status > 0)
				  $scope.errorMsg = res.status + ': ' + res.data;
			});
		};

		function gotInitialInfo() {
			return $http.get('/auth/initial')
					.then(function(res) {
						return res.data;
					}, function(res) {
						console.log(res);
					});
		}

		$scope.next = function() {
			gotInitialInfo()
			.then(function() {
				$state.go('main');
			})
			.catch(function() {
				console.log('Error!');
			});
		};
	}
]);