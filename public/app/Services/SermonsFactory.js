/**
 * Created by Josh Pagley on 4/19/14.
 */

angular.module('zcApp').factory('SermonsFactory', ['$resource','$http', '$q', function($resource, $http, $q){
    var sermonsResource = $resource('/api/zionconnect/v1/church/sermon');
    var sermonsUpdateResource = $resource('/api/zionconnect/v1/church/sermon', {}, { update: {method: 'PUT'}});
    var retrieveAllSermonsResource = $resource('/api/zionconnect/v1/church/sermon/list');
    var sermonCommentResource = $resource('/api/zionconnect/v1/church/sermon/comment');
    var sermonCommentLikeResource = $resource('/api/zionconnect/v1/church/sermon/comment/like');

    /**
     * vm.sermons contains a list of just the individual sermons.
     * vm.series contains a list of the series objects. Each series object
     * contains an array of the associated sermons in the sermons array.
     *
     * This strategy is used for quick display changing in the sermons list view.
     */
    var vm = {};
    vm.sermons = [];
    vm.series = [];
    vm.sermon = {};

    function addSermonToSeries(series, sermon){
        if(sermon && series){
            var updatedExistingSeries = false;

            if(vm.series.length > 0){
                vm.series.forEach(function(series, index){
                    if(series._id == sermon.series){
                        vm.series[index].sermons.push(sermon);
                        updatedExistingSeries = true;
                    }
                });
            }

            if(!updatedExistingSeries){
                vm.series.push(series);
            }
        }
    }

    function replaceSermonLocallyWithUpdatedVersion(sermon){
        vm.sermons.forEach(function(element, index){
            if(element._id == sermon._id){
                vm.sermons.splice(index, 1, sermon);
            }
        });

        vm.series.forEach(function(series, seriesIndex){
            if(series._id == sermon.series){
                vm.series[seriesIndex].sermons.forEach(function(element, sermonIndex){
                    if(element._id == sermon._id){
                        vm.series[seriesIndex].sermons.splice(sermonIndex, 1, sermon);
                    }
                });
            }
        });
    }

    function removeDeletedSermonLocally(sermon){
        vm.sermons.forEach(function(element, index){
            if(element._id == sermon._id){
                vm.sermons.splice(index, 1);
            }
        });

        vm.series.forEach(function(series, seriesIndex){
            if(series._id == sermon.series){
                vm.series[seriesIndex].sermons.forEach(function(element, sermonIndex){
                    if(element._id == sermon._id){
                        vm.series[seriesIndex].sermons.splice(sermonIndex, 1);
                    }
                });
            }
        });
    }

    /**
     * Create Sermon
     * Adds newly created sermon to vm.series and vm.sermons.
     * Returns promise object.
     * Takes object of the new sermon to create.
     */
    vm.createSermon = function(sermon){
        var promise = $q.defer();
        sermonsResource.save(sermon, function(result){
            addSermonToSeries(result.series, result.sermon);
            vm.sermons.push(result.sermon);
            promise.resolve();
        }, function(error){
            console.log(error);
            promise.reject();
        });
        return promise.promise;
    };


    /**
     * Update Sermon
     *
     * Replaces local version of sermon with the new
     * updated version from server.
     */
    vm.updateSermon = function(sermonObj){
        var promise = $q.defer();
        sermonsUpdateResource.update(sermonObj, function(result){
            var updatedSermon = {};
            updatedSermon = result.sermon;
            updatedSermon['tags'] = result.sermon.tags.join(', ');
            vm.sermon = updatedSermon;
            replaceSermonLocallyWithUpdatedVersion(result.sermon);
            promise.resolve();
        }, function(error){
            promise.reject();
        });

        return promise.promise;
    };

    /**
     * Delete Sermon
     *
     * This will remove the sermon server side and locally from the
     * vm.series and vm.sermons.
     */
    vm.deleteSermon = function(){
        if(vm.sermon){
            var promise = $q.defer();
            sermonsResource.delete(vm.sermon, function(result){
                removeDeletedSermonLocally(vm.sermon);
                vm.sermon = {};
                promise.resolve();
            }, function(error){
                promise.reject();
            });

            return promise.promise;
        }
    }

    /**
     * Retrieve List of Sermons
     *
     * Retrieves sermons and series from server and adds them
     * to vm.series and vm.sermons.
     */
    vm.retrieveSermons = function(churchID){
        var promise = $q.defer();
        retrieveAllSermonsResource.get({'owner': churchID}, function(result){
            vm.sermons = result.sermons || [];
            vm.series = result.series || [];

            promise.resolve();
        }, function(error){
            promise.reject();
        });

        return promise.promise;
    }

    /**
     * Retrieve Single Sermon by ID From Server.
     */
    vm.retrieveSermonById =  function(sermonID){
        var promise = $q.defer();

        sermonsResource.get({'id': sermonID}, function(result){
            var sermon = result.sermon;
            sermon.tags = result.sermon.tags.join(', ');
            vm.sermon = sermon;
            promise.resolve();
        }, function(error){
            promise.reject(error);
        });

        return promise.promise;
    }



    return vm;
}]);