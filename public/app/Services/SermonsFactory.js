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
    vm.sermonBeingEdited = {};

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
            vm.sermonBeingEdited = updatedSermon;
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
        if(vm.sermonBeingEdited){
            var promise = $q.defer();
            sermonsResource.delete(vm.sermonBeingEdited, function(result){
                removeDeletedSermonLocally(vm.sermonBeingEdited);
                vm.sermonBeingEdited = {};
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
            vm.sermonBeingEdited = result.sermon;
            vm.sermonBeingEdited.tags = result.sermon.tags.join(', ');
            promise.resolve();
        }, function(error){
            promise.reject(error);
        });

        return promise.promise;
    }

    /**
     * Retrieve Single Sermon by ID From Local Sermons Array.
     * If Sermon is not found locally then make request to
     * the server for the sermon.
     */
    vm.retrieveSermonFromLocal = function(id){
        vm.sermonBeingEdited = {};
        var localSermonFound = false;

        var promise = $q.defer();
        vm.sermons.forEach(function(element){
            if(element._id == id){
                localSermonFound = true;
                vm.sermonBeingEdited = element;
                vm.sermonBeingEdited.tags = element.tags.join(', ');
            }
        });

        if(localSermonFound){
            promise.resolve();
            return promise.promise;
        }

        if(!localSermonFound){
           return vm.retrieveSermonById(id);
        }
    }

    return vm;

    //================================================
    //Old SermonsFactory code
    //================================================

//    var sermons = [];
//
//    return {
//        //Used by SermonAddController
//        createSermon: function(sermonObj){
//            var promise = $q.defer();
//            sermonsResource.save(sermonObj, function(result){
//                promise.resolve(result);
//            }, function(error){
//                promise.reject(error);
//            });
//
//            return promise.promise;
//        },
//        //Used by SermonEditController
//        updateSermon: function(sermonObj){
//            var promise = $q.defer();
//            sermonsUpdateResource.update(sermonObj, function(result){
//                promise.resolve(result);
//            }, function(error){
//                promise.reject(error);
//            });
//
//            return promise.promise;
//        },
//        //Used inside SermonsController
//        retrieveSermons: function(churchID){
//            console.log('retrieving posts from server.')
//            var promise = $q.defer();
//            retrieveAllSermonsResource.get({'owner': churchID}, function(result){
//                sermons = result.sermons;
//                console.log('zcSermons sermons: ');
//                console.log(result.sermons);
//                promise.resolve(result);
//            }, function(error){
//                promise.reject(error);
//            });
//
//            return promise.promise;
//        },
//        //Used inside of SermonHomeController
//        retrieveSermonById: function(sermonID){
//            var promise = $q.defer();
//            sermonsResource.get({'id': sermonID}, function(result){
//                sermons = result.sermon;
//                console.log('zcSermons sermon: ');
//                console.log(result.sermon);
//                promise.resolve(result);
//            }, function(error){
//                promise.reject(error);
//            });
//
//            return promise.promise;
//        },
//        //Used by SermonHomeController
//        createComment: function(commentObj){
//            var promise = $q.defer();
//            sermonCommentResource.save(commentObj, function(result){
//                promise.resolve(result);
//            }, function(error){
//                promise.reject(error);
//            });
//
//            return promise.promise;
//        },
//        //Used by SermonHomeController
//        likeComment: function(likeObj){
//            var promise = $q.defer();
//            sermonCommentLikeResource.save(likeObj, function(result){
//                promise.resolve(result);
//            }, function(error){
//                promise.reject(error);
//            });
//
//            return promise.promise;
//        }
//   }
}]);