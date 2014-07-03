/**
 * Created by Josh Pagley on 2/25/14.
 */
/**
 This is the Feed Controller. This will handle any activity that has to do
 with the feed.
 */

angular.module('zcApp').controller('FeedController', ['$scope', '$window', 'zcIdentity', 'zcFeed', 'zcNotifications',
    function($scope, $window, zcIdentity, zcFeed, zcNotifications){

        //Current User Object
        //$scope.currentUser = {};
        var admin = {};
        var church = {};

        //Current Posts
        $scope.posts = [];

        //Retrieve Admin User and Church Object From Server
        if(!admin.email){
            var promise = zcIdentity.getIdentity();
            promise.then(function(result){
                //set admin and church objects with accounts returned from server.
                admin = result.admin;
                church = result.church;

                //Retrieve Posts Associated With Current User ID.
                if(church._id && $scope.posts.length < 1){;
                    var promise;
                    promise = zcFeed.retrievePosts(church._id);
                    promise.then(function(result){
                        $scope.posts = result.posts;
                        console.log(result);
                    }, function(error){
                        console.log(error);
                    });
                }

            }, function(error){
                console.log('Error: ' + error);
            });
        }

        /**
         * Create New Post
         */

        var newPost = {};
        $scope.createPost = function(text){
            if(church._id){
                if(admin._id){
                    if(text != ""){
                        newPost['author'] = admin._id;
                        newPost['owner'] = church._id;
                        newPost['text'] = text;

                        var promise = zcFeed.createPost(newPost);

                        promise.then(function(result){
                            $scope.posts.unshift(result.post);
                            $scope.newPostObj = {};
                            newPost = {};
                        }, function(error){
                            console.log(error);
                        });
                    } else {
                        console.log('post body is empty.');
                    }
                } else {
                    console.log('admin._id is undefined.');
                }
            } else {
                console.log('church._id is undefined.');
            }
        }

        /**
         * Create New Comment
         */
        $scope.newCommentObj = {};

        $scope.createComment = function(postID, index){
            var newCommentObj = {};

            newCommentObj['author'] = admin._id;
            newCommentObj['post'] = $scope.posts[index];
            newCommentObj['authorName'] = admin.name;
            //The view puts the comment body in the the newCommentObj key under the posts id.
            newCommentObj['body'] = $scope.newCommentObj[postID];

            var promise = zcFeed.createComment(newCommentObj);

            promise.then(function(result){
                $scope.posts[index].comments.unshift(result.comment);

//                var newNotification = {};
//                newNotification['sender'] = $scope.currentUser._id;
//                newNotification['recipient'] = owner;
//
//                zcNotifications.createNotification()

                $scope.newCommentObj = {};
            }, function(error){
                console.log(error);
            });
        }

    }]);