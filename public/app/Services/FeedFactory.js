/**
 * Created by Josh Pagley on 4/4/14.
 * Description: Service that handles webservice calls for the feed.
 */

angular.module('zcApp').factory('FeedFactory',['$resource', '$q', 'IdentityFactory', function($resource, $q, IdentityFactory) {

    var postsResource = $resource('/api/zionconnect/v1/church/posts');
    var commentsResource = $resource('/api/zionconnect/v1/church/comments');
    var likesResource = $resource('/api/zionconnect/v1/church/likes');

    var vm = {};

    vm.posts = [];

    vm.retrievePosts = function(){
        if(IdentityFactory.church._id){
            var promise = $q.defer();
            postsResource.get({'churchID': IdentityFactory.church._id, 'num_posts': vm.posts.length}, function(result){
                vm.posts = result.posts;
                promise.resolve();
            }, function(error){
                //Todo: Create Error Notification for retrieving posts error.
                console.log(error);
                promise.reject();
            });

            return promise.promise;
        } else {
            //Todo: Create Error Notification for retrieving posts error.
            console.log('Could not retrieve posts.');
        }
    }

    vm.createPost = function(text){
        if(IdentityFactory.church._id){
            if(IdentityFactory.admin._id){
                if(text != ""){
                    var newPost = {};
                    newPost['author'] = IdentityFactory.admin._id;
                    newPost['owner'] = IdentityFactory.church._id;
                    newPost['text'] = text;

                    var promise = $q.defer();
                    postsResource.save(newPost, function(result){
                        vm.posts.unshift(result.post);
                        promise.resolve();
                    }, function(error){
                        //todo: Error popup if they cant create a new post.
                        console.log(error);
                        promise.reject();
                    });

                    return promise.promise;

                } else {
                    console.log('post text is empty.');
                }
            } else {
                console.log('IdentityFactory.admin._id is undefined.');
            }
        } else {
            console.log('IdentityFactory.church._id is undefined.');
        }
    }

    vm.deletePost = function(post){
        if(post._id){

            var promise = $q.defer();
            postsResource.delete({'postID': post._id}, function(result){

                vm.posts.forEach(function(element, index){
                    if(element._id == post._id){
                        vm.posts.splice(index, 1);
                    }
                });

                promise.resolve();
            }, function(error){
                //todo: Error popup if they cant create a new post.
                console.log(error);
                promise.reject();
            });

            return promise.promise;
        }  else {
            //todo: Error notification when not able to delete post.
            console.log('No post _id. No able to delete post.');
        }
    }

    vm.createComment = function(text, post, index){
        if(IdentityFactory.admin._id){
            var newComment = {};
            newComment['author'] = IdentityFactory.admin._id;
            newComment['post'] = post;
            newComment['authorName'] = IdentityFactory.admin.name;
            newComment['body'] = text;

            var promise = $q.defer();
            commentsResource.save(newComment, function(result){

                vm.posts.forEach(function(element, index){
                    if(element._id == post._id){
                        if(!result.updatedExistingCommentPage){
                            vm.posts[index].num_comment_pages = result.numCommentPages;
                        }
                        vm.posts[index].num_comments += 1;
                        vm.posts[index].comments.push(result.comment);
                        console.log(vm.posts[index].num_comments);
                    }
                });

                promise.resolve();
            }, function(error){
                //todo: Error notification when not able to comment.
                console.log(error);
                promise.reject();
            });

            return promise.promise;
        } else {
            //todo: Error notification when not able to comment.
            console.log('No Identity. Cannot create comment.');
        }


    }

    vm.deleteComment = function(deleteComment, post){
        if(deleteComment._id){
            var commentObj = {
                _id: deleteComment._id,
                ts: deleteComment.ts,
                body: deleteComment.body,
                author_name: deleteComment.author_name,
                author: deleteComment.author,
                page: deleteComment.page,
                postID: deleteComment.postID
            }

            var promise = $q.defer();
            commentsResource.delete(commentObj, function(result){

                vm.posts.forEach(function(post, postIndex){
                    if(post._id == deleteComment.postID){
                        post.comments.forEach(function(comment, index){
                            if(comment._id == deleteComment._id){
                                vm.posts[postIndex].comments.splice(index, 1);
                                if(vm.posts[postIndex].num_comments > 0){
                                    vm.posts[postIndex].num_comments -= 1;
                                }
                                return;
                            }
                        });
                    }
                });

                promise.resolve();
            }, function(error){
                //todo: Error popup if they cant create a new post.
                console.log(error);
                promise.reject();
            });

            return promise.promise;
        }  else {
            //todo: Error notification when not able to delete post.
            console.log('No post _id. No able to delete post.');
        }
    };

    vm.retrieveComments = function(post){
        if(post._id){
            var promise = $q.defer();
            commentsResource.get({'postID': post._id}, function(result){
                vm.posts.forEach(function(element, index){
                    if(element._id == post._id){
                        vm.posts[index].comments = result.comments;
                    }
                });
                promise.resolve();
            }, function(error){
                //Todo: Error notification when not able to retrieve comments.
                console.log(error);
                promise.reject();
            });

            return promise.promise;
        } else {
            //Todo: Error notification when not able to retrieve comments.
            console.log('No able to retrieve comments for post.')
        }
    };

    vm.like = function(post){
        var firstTimeLike = post.likes.every(function(like){
            if(like.by == IdentityFactory.admin._id){
                return false;
            } else {
                return true;
            }
        });

        if(firstTimeLike){
            if(post._id){
                if(IdentityFactory.admin._id){
                    var newLike = {};
                    newLike['postID'] = post._id;
                    newLike['name'] = IdentityFactory.admin.name;
                    newLike['by'] = IdentityFactory.admin._id;

                    var promise = $q.defer();
                    likesResource.save(newLike, function(result){

                        vm.posts.forEach(function(element, index){
                            if(element._id == post._id){
                                if(result.like){
                                    vm.posts[index].likes.push(result.like);
                                }
                            }
                        });

                        promise.resolve();
                    }, function(error){
                        //todo: Error notification when not able to comment.
                        console.log(error);
                        promise.reject();
                    });

                    return promise.promise;
                } else {
                    //Todo: Error notification when not able to like post.
                    console.log('Not able to add like to post.')
                }
            } else {
                //Todo: Error notification when not able to like post.
                console.log('Not able to add like to post.')
            }
        } else {
            console.log('Cannot like post twice.');
        }
    }

    vm.unlike = function(post){
        if(post._id){
            var unlike = {};
            unlike['postID'] = post._id;

            post.likes.forEach(function(like, index){
                if(like.by == IdentityFactory.admin._id){
                    return unlike['likeID'] = like._id;
                }
            });

            if(unlike['postID'] != ""){
                if(unlike['likeID'] != ""){

                    var promise = $q.defer();
                    likesResource.delete(unlike, function(result){

                        //Remove like from vm.posts
                        vm.posts.forEach(function(post, postIndex){
                            if(post._id == unlike.postID){
                                post.likes.forEach(function(like, index){
                                    if(like._id == unlike.likeID){
                                        vm.posts[postIndex].likes.splice(index, 1);
                                        return;
                                    }
                                });
                                return;
                            }
                        });

                        promise.resolve();

                    }, function(error){
                        console.log(error);
                        promise.reject();
                    });

                    return promise.promise;
                } else {
                    console.log('No like _id.')
                }
            } else {
                console.log('No post _id.')
            }
        } else {
            //Todo: Error notification when not able to unlike post.
            console.log('Not able to unlike post.')
        }
    }

    return vm;


}]);