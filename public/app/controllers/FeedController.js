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

        if(!IdentityFactory.church._id){
            /**
             * Retrieve Identity from server and then retrieve posts.
             */
            var promise = IdentityFactory.getIdentity();
            promise.then(function(){
                if(IdentityFactory.church._id && FeedFactory.posts.length < 1){
                    var promise = FeedFactory.retrievePosts(IdentityFactory.church._id);
                    promise.then(function(){
                        $scope.posts = FeedFactory.posts;
                    }, function(error){
                        return displayError('Not able to load posts at this time. Please try again later.');
                    });
                }
            }, function(error){});
        } else {
            /**
             * Retrieve Posts With Church ID
             */
            if(FeedFactory.posts.length < 1){
                var promise = FeedFactory.retrievePosts(IdentityFactory.church._id);
                promise.then(function(){
                    $scope.posts = FeedFactory.posts;
                }, function(error){
                    return displayError('Not able to load posts at this time. Please try again later.');
                });
            } else if (FeedFactory.posts.length > 0){
                //Todo:Check every so often to see if any new posts have been created.
                $scope.posts = FeedFactory.posts;
            }
        }

        /**
         * Display Error Message
         */
        $scope.displayErrorMessagePopup = false;
        $scope.errorMessage = "";

        function displayError(message){
            $scope.errorMessage = "Sorry! " + message;
            $scope.displayErrorMessagePopup = true;
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
         * See more posts
         */
        $scope.seeMorePosts = function(){
            var promise = FeedFactory.retrievePosts(IdentityFactory.church._id);
            promise.then(function(){
                $scope.posts = FeedFactory.posts;
            }, function(){
               return displayError('Not able to load any more posts at this time. Please try again later.');
            });
        }

        /**
         * Create New Post
         */
        $scope.createPost = function(text){
           var promise = FeedFactory.createPost(text);
            promise.then(function(){}, function(){
                return displayError('Not able to create a new post at this time. Please try again later.');
            })
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
                var promise = FeedFactory.deletePost(post);
                promise.then(function(){}, function(){
                    displayError('Not able to delete post at this time. Please try again later.');
                })
            }
            $scope.displayDeletePostConfirmationPopup = false;
        }

        /**
         * Create New Comment
         */
        $scope.createComment = function(text, post, index){
           var promise = FeedFactory.createComment(text, post, index);
            promise.then(function(){}, function(){
               return displayError('Not able to comment at this time. Please try again later.');
            });
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
                var promise = FeedFactory.deleteComment(comment);
                promise.then(function(){}, function(){
                    return displayError('Not able to delete comment at this time. Please try again later.');
                });
            }
            $scope.displayDeleteCommentConfirmationPopup = false;
        }

        /**
         * Retrieve Comments
         */
        $scope.retrieveComments = function(post){
            var promise = FeedFactory.retrieveComments(post);
            promise.then(function(){}, function(){
                return displayError('Not able to retrieve the comments for this post at this time. Please try again later.')
            })
        }

        /**
         * Like Post
         */
        $scope.like = function(post){
            var promise = FeedFactory.like(post);
            promise.then(function(){}, function(){
                return displayError('Not able to like post at this time. Please try again later.');
            })
        }

        /**
         * Unlike Post
         */
        $scope.unlike = function(post){
            var promise = FeedFactory.unlike(post);
            promise.then(function(){}, function(){
                return displayError('Not able to unlike post at this time. Please try again later.');
            });
        }

    }]);