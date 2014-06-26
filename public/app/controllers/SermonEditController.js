/**
 * Created by Josh Pagley on 4/24/14.
 */
angular.module('zcApp').controller('SermonEditController', ['$scope', '$routeParams', 'zcIdentity', 'zcSermons',
    function($scope, $routeParams, zcIdentity, zcSermons){

        //Sermon Object
        var sermon = null;

        //Retrieve Sermon Associated With Sermon ID In URL Parameters.
        if(!sermon){
            var promise;
            promise = zcSermons.retrieveSermonById($routeParams.id);
            promise.then(function(result){
                sermon = result.sermon;
                sermon.tags = result.sermon.tags.join(', ');
                $scope.sermonObject = sermon;
            }, function(error){
                console.log(error);
            });
        }

        //Update Sermon
        $scope.sermonObject = {};
        $scope.sermonCreatedSuccessfully = false;
        $scope.sermonCreationFailure = false;
        var newSermon = {};

        $scope.updateSermon = function(){

            newSermon['_id'] = $scope.sermonObject._id;
            newSermon['owner'] = $scope.sermonObject.owner;
            newSermon['part'] = $scope.sermonObject.part;
            newSermon['title'] = $scope.sermonObject.title;
            newSermon['series'] = $scope.sermonObject.series;
            newSermon['notes'] = $scope.sermonObject.notes;
            newSermon['speaker'] = $scope.sermonObject.speaker;
            newSermon['video'] = $scope.sermonObject.video;
            newSermon['audio'] = $scope.sermonObject.audio;

            var tagsArray = $scope.sermonObject.tags.split(',');
            newSermon['tags'] = tagsArray;

            var promise = zcSermons.updateSermon(newSermon);
            promise.then(function(result){
                if(result.sermon){
                    $scope.sermonCreatedSuccessfully = true;
                    $scope.sermonObject = result.sermon;
                }
            }, function(error){
                console.log(error);
                $scope.sermonCreationFailure = true;
            });
        }
    }]);