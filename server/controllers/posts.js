/**
 * Created by Josh Pagley on 4/3/14.
 */

var validator = require('validator');
var async = require('async');
var _ = require('underscore');

//Models
var Post = require('../models/post.js');
var CommentPage = require('../models/commentPage.js')

// create expects a json object in req.body
//
/**
 * Create New Post
 *
 * req body: {'author': authorID, 'owner': ownerID, 'text': postText}
 *
 * author: This is the person who created the post. This could be the church or a member.
 * owner: This is the church id of where the post was posted to. This is always a church.
 * text: This is the content of the post.
 */
exports.create = function(req, res){
    var msgObj = req.body;
    console.log(msgObj);

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.author){
        return res.json(400, {'error': 'postAuthor required.'});
    }

    if(!msgObj.owner){
        return res.json(400, {'error': 'postRecipient required.'});
    }

    if(!msgObj.text){
        return res.json(400, {'error': 'Post message required.'});
    }

    var newPost = {
        'author': msgObj.author,
        'owner': msgObj.owner,
        'num_comment_pages': 0,
        'detail': {
            'text': msgObj.text
        }
    }

    Post.create(newPost, function(error, post){
        if(error){
            return res.json(500, {'error': 'Server Error', 'mongoError': error});
        } else {
            Post.findById(post._id).populate('author').exec(function(error, populatedPost){
                if(error){
                    return res.json(500, {'error': 'Server Error', 'mongoError': error});
                } else {
                    return res.json(200, {'success': 'Successfully created new post.', 'post': populatedPost});
                }
            })
        }
    });
}

exports.retrieve = function(req, res){
    var msgObj = req.query;

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.churchID){
        return res.json(400, {'error': 'churchID is required.'});
    }

    if(msgObj.churchID){

        var options = [
            {path: 'author'}
        ];

        Post.find({'owner': msgObj.churchID}).populate(options).sort({'createdAt': -1}).exec(function(error, posts){
            if(error){
                console.log(error);
                return res.json(500, {'error': 'Server Error', 'mongoError': error});
            } else {
                return res.json(200, {'success': 'Successfully retrieved posts.', 'posts': posts});
            }
        })
    }
}

/**
 * Delete Post
 *
 * This will delete the post and all comment pages
 * belonging to this post.
 *
 * req.query: {'postID': id}
 */
exports.delete = function(req, res){
    var msgObj = req.query;
    console.log(msgObj);

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.postID){
        return res.json(400, {'error': 'postAuthor required.'});
    }

    Post.findById(msgObj.postID, function(error, post){
        if(error){
            console.log(error);
            return res.json(500, {'error': 'Server Error', 'mongoError': error});
        } else if(!post) {
            return res.json(400, {'error': 'No post for that post ID'});
        } else {
            async.parallel([
                function(done){
                    post.remove(function(error){
                        if(error){
                            done(error);
                        } else {
                            done();
                        }
                    });
                },
                function(done){
                    if(msgObj.postID){
                        CommentPage.remove({'node_id': msgObj.postID}, function(error){
                            if(error){
                                done(error);
                            } else {
                                done();
                            }
                        });
                    } else {
                        done(new Error('No post id to query comment pages.'));
                    }

                }],
                function(error){
                    if(error){
                        console.log(error);
                        return res.json(500, {'error': error});
                    } else {
                        return res.json(200, {'success': 'Successfully deleted post.'});
                    }
                });
        }
    });
}

/**
 * Create Comment
 *
 * This function handles creating comments on the posts in the main feed.
 * It will create/update comment pages depending on what is needed for the operation.
 * This will also add the most recent comments into the post's comments cache.
 *
 * req body: {'node_id': postID, 'author': id, 'authorName': name, 'body': commentText }
 *
 * node_id: This is the id of the post that the comment was added to.
 * author: The id of the person who created the comment.
 * authorName: This the name of the person who created the comment.
 * body: This is the text of the comment.
 */
exports.createComment = function(req, res){
    var msgObj = req.body;
    console.log('Create comment hit');
    console.log(msgObj);

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.author){
        return res.json(400, {'error': 'Author is required.'});
    }

    if(!msgObj.authorName){
        return res.json(400, {'error': 'Author name is required.'});
    }

    if(!msgObj.post){
        return res.json(400, {'error': 'post is required.'});
    }

    if(!msgObj.body){
        return res.json(400, {'error': 'Body is required.'});
    }

    var comment = {
        'author': msgObj.author,
        'author_name': msgObj.authorName,
        'body': msgObj.body,
        'page': msgObj.post.num_comment_pages,
        'ts': new Date()
    };

    CommentPage.update({
        'node_id': msgObj.post._id,
        'page': msgObj.post.num_comment_pages,
        'count': {$lt: 5}},{
        $inc: {'count': 1},
        $push: {'comments': comment}
    }, function(error, numberAffected, raw){
        console.log(raw);
        if(error){
            console.log(error);
            return res.json(500, {'error': 'Server Error.', 'mongoError': error});
        } else if (raw.updatedExisting){
            console.log('Updated existing.');
            /**
             * If currently existing Comment Page can be updated instead of creating a new page.
             * raw.updatedExisting will return true it updated a document.
             *
             * async.waterfall: (1) Find the most recent CommentPage and return the most
             *                  recent comment from that page.
             *                  (2) Update Post document. Push the comment that has been created inside the new
             *                  commentPage into the comment cache on the post document.
             *                  The comments cache will only hold up to 5 comment documents.
             *                  It removes the oldest comment in the cache replacing it with the new one.
             *                  (3) Return the newly created comment back to the client.
             */
            async.waterfall([
                function(done){
                    CommentPage.findOne({'node_id': msgObj.post._id, 'page': msgObj.post.num_comment_pages}, function(error, commentPage){
                        if(error){
                            done(error);
                        } else if (!commentPage) {
                            done(new Error('No comment page with that node_id or page count.'));
                        } else {
                            var newComment = commentPage.comments[commentPage.comments.length - 1];
                            done(null, newComment);
                        }
                    });
                },
                function(newComment, done){
                    Post.findById(msgObj.post._id, function(error, post){
                        if(error){
                            done(error);
                        } else if (!post){
                            done(new Error('Not able to add most recent comment to comments array.'));
                        } else {
                            if(post.comments.length >= 5){
                                post.comments.splice(post.comments.length - 1, 1);
                                post.comments.unshift(newComment);
                                post.save(function(error){
                                    if(error){
                                        done(error);
                                    } else {
                                        done(null, newComment);
                                    }
                                });
                            } else {
                                post.comments.unshift(newComment);
                                post.save(function(error){
                                    if(error){
                                        done(error);
                                    } else {
                                        done(null, newComment);
                                    }
                                });
                            }
                        }
                    });
                }],
                function(error, newComment){
                    console.log('Updated existing comment page.');
                    console.log(newComment);
                    if(error){
                        console.log(error);
                        return res.json(500, {'error': error});
                    } else {
                        return res.json(200, {'success': 'Successfully added new comment.', 'updatedExistingCommentPage': true,  'comment': newComment});
                    }
                })
        } else if (!raw.updatedExisting){
            /**
             * Creating a new comment page.
             * Previous pages either do not exist or they are full.
             * raw.updatedExisting will return false if it needs to create a document.
             *
             * async.waterfall: (1) Create the new comment page with the first comment. Pass the newly created
             *                  comment to the next function using the callback.
             *                  (2) Update Post document. Push the comment that has been created inside the new
             *                  comment page into the comment cache on the post document.
             *                  The comments cache will only hold up to 5 comment documents.
             *                  It removes the oldest comment in the cache replacing it with the new one.
             *                  (3) Return the newly created comment back to the client.
             */

            async.waterfall([
                function(done){
                    comment['page'] = msgObj.post.num_comment_pages + 1;

                    var newCommentPage = {
                        'node_id': msgObj.post._id,
                        'page': msgObj.post.num_comment_pages + 1,
                        'count': 1,
                        comments: [comment]
                    };

                    CommentPage.create(newCommentPage, function(error, commentPage){
                        if(error){
                            done(error);
                        } else if (!commentPage) {
                            done(new Error('Error adding new comment.'));
                        } else {
                            var newComment = commentPage.comments[0];
                            done(null, newComment)
                        }
                    });
                },
                function(newComment, done){
                    Post.findById(msgObj.post._id, function(error, post){
                        if(error){
                            done(error);
                        } else if (!post){
                            done(new Error('Not able to add most recent comment to comments array.'));
                        } else {
                            if(post.comments.length >= 5){
                                post.num_comment_pages += 1;

                                post.comments.splice(post.comments.length - 1, 1);
                                post.comments.unshift(newComment);

                                post.save(function(error){
                                    if(error){
                                        done(error);
                                    } else {
                                        done(null, newComment, post.num_comment_pages);
                                    }
                                });
                            } else {
                                post.num_comment_pages += 1;

                                post.comments.unshift(newComment);

                                post.save(function(error){
                                    if(error){
                                        done(error);
                                    } else {
                                        done(null, newComment, post.num_comment_pages);
                                    }
                                });
                            }
                        }
                    });
                }],
                function(error, newComment, numCommentPages){
                    console.log('created new comment page.');
                    if(error){
                        console.log(error);
                        return res.json(500, {'error': error});
                    } else {
                        console.log(newComment);
                        console.log(numCommentPages);
                        return res.json(200, {'success': 'Successfully added new comment.', 'updatedExistingCommentPage': false, 'numCommentPages': numCommentPages, 'comment': newComment});
                    }
                });
        }
    });
}

/**
 * Delete Comment From Post
 *
 * This will delete the comment from the comment page that contains it.
 * If it is also in the Post's comment cache it will delete it from there
 * also.
 *
 * req.query: {'comment': object, 'postID': id, 'page': number}
 */
exports.deleteComment = function(req, res){
    var msgObj = req.query;

    if(!msgObj){
        return res.json(400, {'error': 'Query is required.'});
    }

    if(!msgObj.comment){
        return res.json(400, {'error': 'Comment is required.'});
    }

    if(!msgObj.postID){
        return res.json(400, {'error': 'Post id is required.'});
    }

    if(!msgObj.page){
        return res.json(400, {'error': 'Page number is required.'});
    }

    CommentPage.findOne({'node_id': msgObj.postID, 'page': msgObj.page}, function(error, page){
        if(error){
            return res.json(500, {'error': 'Server error.', 'mongoError': error});
        } else if (!page){
            return res.json(500, {'error': 'No comment page matches those query parameters.'});
        } else {
            async.parallel([
                function(done){
                    if(msgObj.comment._id){
                        page.comments.id(msgObj.comment._id).remove();
                        done();
                    } else {
                        done(new Error('No comment _id.'));
                    }

                },
                function(done){
                    Post.findById(msgObj.postID, function(error, post){
                        if(error){
                            done(error);
                        } else if(!post){
                            done(new Error('No post for that _id'));
                        } else {
                            post.comments.forEach(function(element, index){
                                if(element.author == msgObj.comment.author && element.body == msg.comment.body){
                                    page.comments.splice(index, 1);
                                    done();
                                } else {
                                    done();
                                }
                            });
                        }
                    });

                }],
                function(error){
                    if(error){
                        return res.json(500, {error: 'Error deleting comment.'});
                    } else {
                        return res.json(200, {'success': 'Successfully deleted comment.'});
                    }
                })
        }
    })


}