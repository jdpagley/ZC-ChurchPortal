/**
 * Created by Josh Pagley on 4/4/14.
 * Description: Service that handles webservice calls for the feed.
 */

angular.module('zcApp').factory('zcFeed',['$resource', '$q', function($resource, $q) {

    var postsResource = $resource('/api/zionconnect/v1/church/posts');
    var commentsResource = $resource('/api/zionconnect/v1/church/posts/comment');

    return {
        // postsResource.save(...) makes a POST request back to the server.
        // the post body is specified by the object past to updateChurchSettings.
        createPost: function(postObj){
            var promise = $q.defer();
            postsResource.save(postObj, function(result){
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        },
        retrievePosts: function(churchID){
            console.log('retrieving posts from server.')
            var promise = $q.defer();
            postsResource.get({'churchID': churchID}, function(result){
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        },
        createComment: function(commentObj){
            var promise = $q.defer();
            commentsResource.save(commentObj, function(result){
                promise.resolve(result);
            }, function(error){
                promise.reject(error);
            });

            return promise.promise;
        }
    }


}]);