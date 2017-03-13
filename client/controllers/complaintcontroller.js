/**
 * Created by shubz on 12/3/17.
 */
angular.module('nexus').controller('complaintcontroller', ['$scope', '$state', '$http','$location','Upload',
    function($scope, $state, $http,$location,Upload) {


        $scope.submitcomplaint = function() {

            var complaints= {
                isanonymous: $scope.complaintform.isanonymous,
                body: $scope.complaintform.body,
                file: $scope.complaintform.file
            };
            if(complaints.isanonymous == undefined)
                complaints.isanonymous = false;
            console.log(complaints);
            return $http.post('/complaint/register', {
                complaints: complaints,
            }).then(function () {
                console.log("post request complete");
            }, function (err) {
                console.log(err);
                $scope.error="some error";
            });
        };

        $scope.upload = function(file) {
            console.log(file);
            Upload.upload({
                url: 'upload/file',
                data: {
                    file: file
                }
            }).then(function(res) {
                var fileUrl = $location.protocol() + '://' + location.host + '/d/' + res.data.fileName;
                console.log(fileUrl);
                $scope.complaintform.file=fileUrl;
            }, function(err) {
                console.log(err);
            });
        };

        function temp(){
            return $http.get('/user_data/complaint').then(function (res) {
                console.log(res.data);
                tmplist = [];
                for(var tmpdata in res.data){
                    console.log(res.data[tmpdata].body);
                    tmplist.push(res.data[tmpdata]);
                }
                // console.log(tmplist);
                $scope.getcomplaint = tmplist;
            },function (err) {
                console.log(err);
                console.log("err");
            });
        }
        $scope.getcomplaint = temp();
    }
]);