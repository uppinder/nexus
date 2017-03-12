/**
 * Created by shivram on 11/3/17.
 */
angular.module('nexus').controller('createGroupController', ['$scope', '$state','$http',
    function($scope, $state,$http) {

        $scope.error = false;

        $scope.createNew = function() {

            return $http.post('/group/createnewGroup', {
                name: $scope.groupName,
                description: $scope.groupDescription

            })
                .then(function(res) {
                    console.log(res);
                    if(res.error){
                        console.log("IMPOSSIBLE ERROR");
                        $scope.error = true;
                        $scope.errorMessage = "Something went wrong!";
                    }
                    else{
                        console.log("DONE!!");
                        $scope.error = false;
                        $state.go('main.group',{id:res.data.group_new._id});
                    }
                }, function() {
                    console.log("RARE ERROR");
                    $scope.error = true;
                    $scope.errorMessage = "Something went wrong!";
                });

        };
    }
]);