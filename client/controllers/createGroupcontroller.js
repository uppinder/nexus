/**
 * Created by shivram on 11/3/17.
 */
angular.module('nexus').controller('createGroupController', ['$scope', '$state','$http',
    function($scope, $state,$http) {

        $scope.error = false;

        $scope.createNew = function() {

            return $http.post('/createnewGroup', {
                name: $scope.groupName,
                description: $scope.groupDescription
                /*
                 * How to send user details here(the current logged in user)
                 * */

            })
                .then(function(res) {
                    /*
                        how to check if groupname already exist and give error msg accordingly
                    */

                }, function() {
                    $scope.error = true;
                    $scope.errorMessage = "Something went wrong!";
                });

        };
    }
]);