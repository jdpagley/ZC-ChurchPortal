/**
 * Created by Josh Pagley on 4/24/14.
 */
angular.module('zcApp').controller('SermonEditController', ['$scope', '$routeParams', 'IdentityFactory', 'SermonsFactory',
    function($scope, $routeParams, IdentityFactory, SermonsFactory){

        $scope.sermonEditedSuccessfully = false;
        $scope.sermonEditFailure = false;
        $scope.sermonDeletedSuccessfully = false;
        $scope.sermonDeletionFailure = false;
        $scope.displayDeleteSermonConfirmationPopup = false;

        SermonsFactory.sermon = {};

        if(!IdentityFactory.admin._id){
            var promise = IdentityFactory.getIdentity();
            promise.then(function(){
                /**
                 * Retrieve sermon from server if SermonsFactory.sermons is empty.
                 */
                var promise = SermonsFactory.retrieveSermonById($routeParams.id);
                promise.then(function(){
                    $scope.sermonObject = SermonsFactory.sermon;
                }, function(){});
            }, function(error){});
        } else {
            /**
             * Retrieve sermon from server if SermonsFactory.sermons is empty.
             */
            var promise = SermonsFactory.retrieveSermonById($routeParams.id);
            promise.then(function(){
                $scope.sermonObject = SermonsFactory.sermon;
            }, function(){});
        }

        $scope.updateSermon = function(sermon){
            var updatedSermon = {};
            updatedSermon['_id'] = sermon._id;
            updatedSermon['owner'] = sermon.owner;
            updatedSermon['part'] = sermon.part;
            updatedSermon['title'] = sermon.title;
            updatedSermon['speaker'] = sermon.speaker;
            updatedSermon['notes'] = sermon.content.notes;
            updatedSermon['video'] = sermon.content.video;
            updatedSermon['audio'] = sermon.content.audio;

            var tags = sermon.tags.split(',');
            var filteredTags = [];
            tags.forEach(function(element){
                if(element !== undefined){
                    filteredTags.push(element.trim());
                }
            });
            updatedSermon['tags'] = filteredTags;

            var promise = SermonsFactory.updateSermon(updatedSermon);
            promise.then(function(){
                $scope.sermonEditedSuccessfully = true;
                $scope.sermonObject = SermonsFactory.sermon;
            }, function(){
                $scope.sermonEditFailure = true;
            });
        };

        $scope.deleteSermon = function(){
            $scope.displayDeleteSermonConfirmationPopup = false;

            var promise = SermonsFactory.deleteSermon();
            promise.then(function(){
                $scope.sermonDeletedSuccessfully = true;
                $scope.sermonObject = {};
            }, function(){
                $scope.sermonDeletionFailure = true;
            });
        }
    }]);