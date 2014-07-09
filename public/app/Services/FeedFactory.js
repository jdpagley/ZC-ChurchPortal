/**
 * Created by Josh Pagley on 4/4/14.
 * Description: Service that handles webservice calls for the feed.
 */

angular.module('zcApp').factory('FeedFactory',['$resource', '$q', 'IdentityFactory', function($resource, $q, IdentityFactory) {

    var postsResource = $resource('/api/zionconnect/v1/church/posts');
    var commentsResource = $resource('/api/zionconnect/v1/church/posts/comment');

    var vm = {};

    vm.posts = [];

    vm.retrievePosts = function(){
        if(IdentityFactory.church._id){
            var promise = $q.defer();
            postsResource.get({'churchID': IdentityFactory.church._id}, function(result){
                vm.posts = result.posts;
                promise.resolve();
            }, function(error){
                //Todo: Create Error Notification for retrieving posts error.
                console.log(error);
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
                        vm.posts[index].comments.push(result.comment);
                    }
                });

                promise.resolve();
            }, function(error){
                //todo: Error notification when not able to comment.
                console.log(error);
            });

            return promise.promise;
        } else {
            //todo: Error notification when not able to comment.
            console.log('No Identity. Cannot create comment.');
        }


    }

    vm.deleteComment = function(deleteComment, post){
        console.log('vm.deleteComment hit.');
        console.log(deleteComment);
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
                        console.log('Post match.')
                        post.comments.forEach(function(comment, index){
                            if(comment._id == deleteComment._id){
                                console.log('Comment match.')
                                vm.posts[postIndex].comments.splice(index, 1);
                                return;
                            }
                        });
                    }
                });

                promise.resolve();
            }, function(error){
                //todo: Error popup if they cant create a new post.
                console.log(error);
            });

            return promise.promise;
        }  else {
            //todo: Error notification when not able to delete post.
            console.log('No post _id. No able to delete post.');
        }
    }

    return vm;

   /* return {
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
    }*/


}]);