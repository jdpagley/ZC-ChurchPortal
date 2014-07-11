/**
 * Created by Josh Pagley on 2/25/14.
 */
/**
 This is the Feed Controller. This will handle any activity that has to do
 with the feed.
 */

angular.module('zcApp').controller('FeedController', ['$scope','IdentityFactory', 'FeedFactory', 'zcNotifications',
    function($scope, IdentityFactory, FeedFactory, zcNotifications){

        //Current Posts
        $scope.posts = [];

        if(!IdentityFactory.admin._id){
            /**
             * Retrieve Identity from server and then retrieve posts.
             */
            var promise = IdentityFactory.getIdentity();
            promise.then(function(){
                if(IdentityFactory.church._id && FeedFactory.posts.length < 1){
                    var promise = FeedFactory.retrievePosts(IdentityFactory.church._id);
                    promise.then(function(){
                        $scope.posts = FeedFactory.posts;
                    }, function(error){});
                }
            }, function(error){});
        } else {
            /**
             * Retrieve Posts With Church ID
             */
            if(IdentityFactory.church._id && FeedFactory.posts.length < 1){
                var promise = FeedFactory.retrievePosts(IdentityFactory.church._id);
                promise.then(function(){
                    $scope.posts = FeedFactory.posts;
                }, function(error){});
            }
        }

        /**
         * Check is user has liked post already.
         */
        $scope.alreadyLikedPost = function(post){
            var firstTimeLike = post.likes.every(function(like){
                if(like.by == IdentityFactory.admin._id){
                    return false;
                } else {
                    return true;
                }
            });

            return firstTimeLike;
        }

        /**
         * Create New Post
         */
        $scope.createPost = function(text){
            FeedFactory.createPost(text);
        }

        /**
         * Delete Post
         */

        var post = {};

        $scope.displayDeletePostConfirmationPopup = false;

        $scope.deletePostPopup = function(postToDelete){
            post = postToDelete;
            $scope.displayDeletePostConfirmationPopup = true;
        }

        $scope.deletePost = function(){
            if(post){
                FeedFactory.deletePost(post);
            }
            $scope.displayDeletePostConfirmationPopup = false;
        }

        /**
         * Create New Comment
         */
        $scope.createComment = function(text, post, index){
           FeedFactory.createComment(text, post, index);
        };

        /**
         * Delete Comment
         */
        var comment = {};

        $scope.displayDeleteCommentConfirmationPopup = false;

        $scope.deleteCommentPopup = function(commentToDelete, postID){
            comment = commentToDelete;
            comment['postID'] = postID;
            $scope.displayDeleteCommentConfirmationPopup = true;
        }

        $scope.deleteComment = function(){
            if(comment){
                FeedFactory.deleteComment(comment);
            }
            $scope.displayDeleteCommentConfirmationPopup = false;
        }

        /**
         * Retrieve Comments
         */
        $scope.retrieveComments = function(post){
            FeedFactory.retrieveComments(post);
        }

        /**
         * Like Post
         */
        $scope.like = function(post){
            FeedFactory.like(post);
        }

        /**
         * Unlike Post
         */
        $scope.unlike = function(post){
            FeedFactory.unlike(post);
        }




//        //Current Posts
//        $scope.posts = [];
//
//        if(!IdentityFactory.admin._id){
//            /**
//             * Get Identity from server and then retrieve posts.
//             */
//            var promise = IdentityFactory.getIdentity();
//            promise.then(function(){
//                //Retrieve Posts Associated With Current User ID.
//                if(IdentityFactory.church._id && $scope.posts.length < 1){
//                    console.log(IdentityFactory.church);
//                    var promise;
//                    promise = zcFeed.retrievePosts(IdentityFactory.church._id);
//                    promise.then(function(result){
//                        $scope.posts = result.posts;
//                        console.log(result);
//                    }, function(error){
//                        console.log(error);
//                    });
//                }
//            }, function(error){});
//        } else {
//            /**
//             * Retrieve Posts With Church ID
//             */
//            if(IdentityFactory.church._id && $scope.posts.length < 1){
//                console.log(IdentityFactory.church);
//                var promise;
//                promise = zcFeed.retrievePosts(IdentityFactory.church._id);
//                promise.then(function(result){
//                    $scope.posts = result.posts;
//                    console.log(result);
//                }, function(error){
//                    console.log(error);
//                });
//            }
//        }
//
//
//
//        /**
//         * Create New Post
//         */
//        $scope.createPost = function(text){
//            if(IdentityFactory.church._id){
//                if(IdentityFactory.admin._id){
//                    if(text != ""){
//                        var newPost = {};
//                        newPost['author'] = IdentityFactory.admin._id;
//                        newPost['owner'] = IdentityFactory.church._id;
//                        newPost['text'] = text;
//
//                        console.log(newPost)
//
//                        var promise = zcFeed.createPost(newPost);
//
//                        promise.then(function(result){
//                            $scope.posts.unshift(result.post);
//                            $scope.newPostObj = {};
//                            newPost = {};
//                        }, function(error){
//                            console.log(error);
//                        });
//                    } else {
//                        console.log('post text is empty.');
//                    }
//                } else {
//                    console.log('IdentityFactory.admin._id is undefined.');
//                }
//            } else {
//                console.log('IdentityFactory.church._id is undefined.');
//            }
//        }
//
//        /**
//         * Create New Comment
//         */
//        $scope.newCommentObj = {};
//
//        $scope.createComment = function(postID, index){
//            var newCommentObj = {};
//            newCommentObj['author'] = IdentityFactory.admin._id;
//            newCommentObj['post'] = $scope.posts[index];
//            newCommentObj['authorName'] = IdentityFactory.admin.name;
//            //The view puts the comment body in the the newCommentObj key under the posts id.
//            newCommentObj['body'] = $scope.newCommentObj[postID];
//
//            var promise = zcFeed.createComment(newCommentObj);
//
//            promise.then(function(result){
//                $scope.posts[index].comments.unshift(result.comment);
//
////                var newNotification = {};
////                newNotification['sender'] = $scope.currentUser._id;
////                newNotification['recipient'] = owner;
////
////                zcNotifications.createNotification()
//
//                $scope.newCommentObj = {};
//            }, function(error){
//                console.log(error);
//            });
//        }

    }]);