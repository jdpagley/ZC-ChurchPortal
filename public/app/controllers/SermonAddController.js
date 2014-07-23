/**
 * Created by Josh Pagley on 4/19/14.
 */

angular.module('zcApp').controller('SermonAddController', ['$scope', 'IdentityFactory', 'SermonsFactory',
    function($scope, IdentityFactory, SermonsFactory){

        $scope.sermonCreatedSuccessfully = false;
        $scope.sermonCreationFailure = false;
        $scope.createSeriesPopup = false;
        $scope.seriesNameAlreadyExistsError = false;
        $scope.seriesList = [];

        /**
         * Check to see if Identity has been populated locally.
         * If identity is populated do nothing.
         * If identity is not populated retrieve identity from server.
         *
         * Check to see if series exist locally.
         * If yes then retrieve them.
         * If not then retrieve them from server.
         */
        if(!IdentityFactory.admin._id){
            var promise = IdentityFactory.getIdentity();
            promise.then(function(){
                if(SermonsFactory.series.length > 0){
                    $scope.seriesList = SermonsFactory.series;
                } else {
                    var promise = SermonsFactory.retrieveSermons(IdentityFactory.church._id);
                    promise.then(function(){
                        $scope.seriesList = SermonsFactory.series;
                    }, function(){});
                }
            }, function(error){});
        } else {
            if(SermonsFactory.series.length > 0){
                $scope.seriesList = SermonsFactory.series;
            } else {
                var promise = SermonsFactory.retrieveSermons(IdentityFactory.church._id);
                promise.then(function(){
                    $scope.seriesList = SermonsFactory.series;
                }, function(){});
            }
        }

        /**
         * Check to see if the new series name already exist.
         * Pass in new series name and if the name doesn't already exist
         * then it will remove the series popup. If it does exist already
         * it will display an error message inside the series popup.
         */
        $scope.validateNewSeriesNameIsUnique = function(name){
            if(name){
                if(SermonsFactory.series.length > 0){
                    var sermonNameDoesntAlreadyExists = SermonsFactory.series.every(function(element, index){
                        if(element.name.toLowerCase() == name.toLowerCase()){
                            return false;
                        } else {
                            return true;
                        }
                    });

                    if(sermonNameDoesntAlreadyExists){
                        $scope.createSeriesPopup = false;
                    } else {
                        $scope.seriesNameAlreadyExistsError = true;
                    }
                } else {
                    $scope.createSeriesPopup = false;
                }
            }
        }

        $scope.createSermon = function(sermonObject){
            var newSermon = {};
            if(IdentityFactory.church._id){
                newSermon['owner'] = IdentityFactory.church._id;
                newSermon['part'] = sermonObject.part;
                newSermon['title'] = sermonObject.title;
                newSermon['notes'] = sermonObject.notes;
                newSermon['speaker'] = sermonObject.speaker;
                newSermon['video'] = sermonObject.video;
                newSermon['audio'] = sermonObject.audio;

                var tags = sermonObject.tags.split(',');
                var filteredTags = [];
                tags.forEach(function(element){
                    if(element !== undefined){
                        filteredTags.push(element.trim());
                    }
                });
                newSermon['tags'] = filteredTags;

                if(sermonObject.newSeries){
                    //Todo:Be able to add series photo for new series.
                    var newSeries = {};
                    newSeries['name'] = sermonObject.newSeries.name;
                    newSeries['newSeries'] = true;
                    newSermon['series'] = newSeries;
                } else {
                    var existingSeries = {};
                    SermonsFactory.series.forEach(function(element){
                        if(element.name == sermonObject.series){
                            existingSeries['newSeries'] = false;
                            existingSeries["_id"] = element._id;
                            existingSeries["name"] = element.name;
                        }
                    });

                    newSermon['series'] = existingSeries;
                }

                if(newSermon['series']){
                    //console.log(newSermon);
                    var promise = SermonsFactory.createSermon(newSermon);
                    promise.then(function(){
                        $scope.sermonObject = {};
                        $scope.sermonCreatedSuccessfully = true;
                    }, function(){
                        $scope.sermonCreationFailure = true;
                    });
                }

            }
        }


    }])