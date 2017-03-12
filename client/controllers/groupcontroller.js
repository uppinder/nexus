/**
 * Created by shivram on 12/3/17.
 */
angular.module('nexus').controller('groupController', ['$scope', '$http', '$state', '$stateParams',
    function($scope, $http,  $state, $stateParams) {


        $scope.error = false;
        $scope.curGroup={};

        function  getGroup(){
            return $http.get('/group/findgroup/' + $stateParams.id)
                .then(function(res) {
                    return res.data;
                }, function(res) {
                    return res;
                });
        }

        $scope.createPost = function() {
           // $scope.presentPost = $scope.newpost;
            return $http.post('/group/createnewPost', {
                text: $scope.newpost,
                group_id:$scope.curGroup._id
            })
                .then(function(res) {
                    console.log(res);
                    if(res.data.error){
                        console.log("IMPOSSIBLE ERROR");
                        $scope.error = true;
                        $scope.errorMessage = "Something went wrong!";
                    }
                    else{
                        console.log("DONE!!");
                        $scope.error = false;
                        $scope.presentPost = res.data.newPost;
                        $scope.curGroup.posts.push(res.data.newPost);
                    }
                }, function() {
                    console.log("RARE ERROR");
                    $scope.error = true;
                    $scope.errorMessage = "Something went wrong!";
                });

        };

        getGroup()
            .then(function (data) {
                if(data.error){
                    $scope.error = true;
                    $scope.errorMessage = "Something went wrong!";
                }
                else{
                    $scope.curGroup = data.curGroup;
                }
            })
            .catch(function (err) {
                $scope.error = true;
                $scope.errorMessage = "Something went wrong!";
            })


    }
]);