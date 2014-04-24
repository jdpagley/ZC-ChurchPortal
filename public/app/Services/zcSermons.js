/**
 * Created by Josh Pagley on 4/19/14.
 */

angular.module('zcApp').factory('zcSermons', ['$resource','$http', '$q', function($resource, $http, $q){
    var sermonsResource = $resource('/api/zionconnect/v1/church/sermon');
    var sermonsUpdateResource = $resource('/api/zionconnect/v1/church/sermon', {}, { update: {method: 'PUT'}});
    var retrieveAllSermonsResource = $resource('/api/zionconnect/v1/church/sermon/list');

    var sermons = [];

    return {
        //Used by SermonAddController
        createSermon: function(sermonObj){
            var promise = $q.defer();
            sermonsResource.save(sermonObj, function(result){
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        },
        //Used by SermonEditController
        updateSermon: function(sermonObj){
            var promise = $q.defer();
            sermonsUpdateResource.update(sermonObj, function(result){
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        },
        //Used inside SermonsController
        retrieveSermons: function(churchID){
            console.log('retrieving posts from server.')
            var promise = $q.defer();
            retrieveAllSermonsResource.get({'owner': churchID}, function(result){
                sermons = result.sermons;
                console.log('zcSermons sermons: ');
                console.log(result.sermons);
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        },
        //Used inside of SermonHomeController
        retrieveSermonById: function(sermonID){
            var promise = $q.defer();
            sermonsResource.get({'id': sermonID}, function(result){
                sermons = result.sermon;
                console.log('zcSermons sermon: ');
                console.log(result.sermon);
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        },
        addSermonToLocalSermonList: function(sermonObj){
            console.log('New sermon added to sermons');
            console.log(sermonObj);
            sermons.push(sermonObj);
            return {
                'success': 'Successfully added sermon to local sermon list.',
                'sermons': sermons
            }
        },
        retrieveLocalSermonList: function(){
            return sermons;
        }
    }
}])