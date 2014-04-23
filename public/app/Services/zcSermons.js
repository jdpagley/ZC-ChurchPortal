/**
 * Created by Josh Pagley on 4/19/14.
 */

angular.module('zcApp').factory('zcSermons', ['$resource', '$q', function($resource, $q){
    var sermonsResource = $resource('/api/zionconnect/v1/church/sermons');

    var sermons = [];

    return {
        createSermon: function(sermonObj){
            var promise = $q.defer();
            sermonsResource.save(sermonObj, function(result){
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
        },
        retrieveSermons: function(churchID){
            console.log('retrieving posts from server.')
            var promise = $q.defer();
            sermonsResource.get({'owner': churchID}, function(result){
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        }
    }
}])