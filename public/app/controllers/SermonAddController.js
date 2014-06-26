/**
 * Created by Josh Pagley on 4/19/14.
 */

angular.module('zcApp').controller('SermonAddController', ['$scope', 'zcIdentity', 'zcSermons',
    function($scope, zcIdentity, zcSermons){

        //Current User Object
        var admin = {};
        var church = {};

        //Retrieve Admin User and Church Object From Server
        if(!admin.email){
            var promise = zcIdentity.getIdentity();
            promise.then(function(result){
                //set admin and church objects with accounts returned from server.
                admin = result.admin;
                church = result.church;
            }, function(error){
                console.log('Error: ' + error);
            });
        }

        //Create New Sermon
        $scope.sermonObject = {};
        $scope.sermonCreatedSuccessfully = false;
        $scope.sermonCreationFailure = false;

        $scope.createSermon = function(){
            var newSermon = {};
            if(church._id){
                newSermon['owner'] = church._id;
                newSermon['part'] = $scope.sermonObject.part;
                newSermon['title'] = $scope.sermonObject.title;
                newSermon['series'] = $scope.sermonObject.series;
                newSermon['notes'] = $scope.sermonObject.notes;
                newSermon['speaker'] = $scope.sermonObject.speaker;
                newSermon['video'] = $scope.sermonObject.video;
                newSermon['audio'] = $scope.sermonObject.audio;

                var tagsArray = $scope.sermonObject.tags.split(',');
                newSermon['tags'] = tagsArray;

                console.log(newSermon);

                var promise = zcSermons.createSermon(newSermon);
                promise.then(function(result){
                    if(result.sermon){
                        $scope.sermonCreatedSuccessfully = true;
                        zcSermons.addSermonToLocalSermonList(result.sermon);
                        $scope.sermonObject = {};
                    }
                }, function(error){
                    console.log(error);
                    $scope.sermonCreationFailure = true;
                });
            }
        }



    }])