/**
 * Created by Josh Pagley on 4/23/14.
 */

angular.module('zcApp').controller('SermonHomeController', ['$scope', '$routeParams', 'IdentityFactory', 'SermonsFactory', 'SermonsHomeFactory',
    function($scope, $routeParams, IdentityFactory, SermonsFactory, SermonsHomeFactory){

        $scope.sermon = {};
        $scope.posts = [];

        SermonsHomeFactory.posts = [];

        if(!IdentityFactory.admin._id){
            var promise = IdentityFactory.getIdentity();
            promise.then(function(){
                /**
                 * Retrieve sermon from server if SermonsFactory.sermons is empty.
                 */
                var promise = SermonsFactory.retrieveSermonById($routeParams.id);
                promise.then(function(){
                    $scope.sermon = SermonsFactory.sermon;

                    /**
                     * Retrieve Posts For Sermon
                     */
                    var promise = SermonsHomeFactory.retrievePosts(SermonsFactory.sermon._id);
                    promise.then(function(){
                        $scope.posts = SermonsHomeFactory.posts;
                    }, function(error){
                        return displayError('Not able to load posts at this time. Please try again later.');
                    });

                }, function(){});
            }, function(error){});
        } else {
            /**
             * Retrieve sermon from server if SermonsFactory.sermons is empty.
             */
            var promise = SermonsFactory.retrieveSermonById($routeParams.id);
            promise.then(function(){
                $scope.sermon = SermonsFactory.sermon;

                /**
                 * Retrieve Posts For Sermon
                 */
                var promise = SermonsHomeFactory.retrievePosts(SermonsFactory.sermon._id);
                promise.then(function(){
                    $scope.posts = SermonsHomeFactory.posts;
                }, function(error){
                    return displayError('Not able to load posts at this time. Please try again later.');
                });

            }, function(){});
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
            var promise = SermonsHomeFactory.retrievePosts(IdentityFactory.church._id);
            promise.then(function(){
                $scope.posts = SermonsHomeFactory.posts;
            }, function(){
                return displayError('Not able to load any more posts at this time. Please try again later.');
            });
        }

        /**
         * Create New Post
         */
        $scope.createPost = function(text){
            var promise = SermonsHomeFactory.createPost(text);
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
                var promise = SermonsHomeFactory.deletePost(post);
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
            var promise = SermonsHomeFactory.createComment(text, post, index);
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
                var promise = SermonsHomeFactory.deleteComment(comment);
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
            var promise = SermonsHomeFactory.retrieveComments(post);
            promise.then(function(){}, function(){
                return displayError('Not able to retrieve the comments for this post at this time. Please try again later.')
            })
        }

        /**
         * Like Post
         */
        $scope.like = function(post){
            var promise = SermonsHomeFactory.like(post);
            promise.then(function(){}, function(){
                return displayError('Not able to like post at this time. Please try again later.');
            })
        }

        /**
         * Unlike Post
         */
        $scope.unlike = function(post){
            var promise = SermonsHomeFactory.unlike(post);
            promise.then(function(){}, function(){
                return displayError('Not able to unlike post at this time. Please try again later.');
            });
        }

//Old Code=========================================================
//        //Current User Object
//        $scope.currentUser = {};
//
//        //Sermon List
//        $scope.sermon = null;
//
//        //Retrieve User Profile From Server On Page Refresh
//        if(!$scope.currentUser.email){
//            var promise;
//            promise = zcIdentity.getIdentity();
//            promise.then(function(result){
//                $scope.currentUser = result;
//            }, function(error){
//                console.log(error);
//            });
//        }
//
//        //Retrieve Sermon Associated With Sermon ID In URL Parameters.
//        if(!$scope.sermon){
//            var promise;
//            promise = zcSermons.retrieveSermonById($routeParams.id);
//            promise.then(function(result){
//                $scope.sermon = result.sermon;
//            }, function(error){
//                console.log(error);
//            });
//        }
//
//        //Add Comments To post
//        $scope.newCommentObj = {};
//
//        $scope.createComment = function(owner){
//            var newCommentObj = {};
//
//            newCommentObj['authorType'] = 'church';
//            newCommentObj['author'] = $scope.currentUser._id;
//            newCommentObj['authorName'] = $scope.currentUser.name;
//            newCommentObj['owner'] = owner;
//            //The view puts the comment body in the the newCommentObj key under the posts id.
//            newCommentObj['body'] = $scope.newCommentObj.body;
//
//            console.log(newCommentObj);
//
//            var promise = zcSermons.createComment(newCommentObj);
//
//            promise.then(function(result){
//                $scope.sermon.comments.unshift(result.comment);
//                console.log(result);
//                $scope.newCommentObj = {};
//            }, function(error){
//                console.log(error);
//            });
//        }
//
//        //Like A Sermon Comment.
//        $scope.likeComment = function(sermonId, commentId, index){
//            var newLikeObj = {};
//
//            newLikeObj['sermonId'] = sermonId;
//            newLikeObj['commentId'] = commentId;
//            newLikeObj['author'] = $scope.currentUser._id;
//            newLikeObj['authorName'] = $scope.currentUser.name;
//
//            console.log(newLikeObj);
//
//            console.log(index);
//
//            var promise = zcSermons.likeComment(newLikeObj);
//
//            promise.then(function(result){
//                $scope.sermon.comments[index].likes.push(result.like);
//                console.log(result);
//            }, function(error){
//                console.log(error);
//            });
//
//        }
    }]);