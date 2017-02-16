angular.module('nexus').controller('initialInfoController', ['$scope', '$state','Upload',	 
	function($scope, $state, Upload) {
		
		$scope.nextButton = false;
		$scope.upload = function(dataUrl, name) {
			Upload.upload({
				url:'upload/profilepic',	
				data: {
					file: Upload.dataUrltoBlob(dataUrl, name)
				}
			}).then(function(res) {
				// console.log(res);
				$scope.result = res.data;
				$scope.nextButton = true;
			}, function(res) {
				 if (res.status > 0)
				  $scope.errorMsg = res.status + ': ' + res.data;
			});
		}

		$scope.next = function() {
			$state.go('main');
		}
	}
]);