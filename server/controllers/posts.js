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
// {'authorType': ['member', 'church'], 'author': authorID, 'authorName': authorName, 'owner': ownerID, 'body': body}
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
                res.json(200, {'success': 'Successfully retrieved posts.', 'posts': posts});
                return;
            }
        })
    }
}

//{'node_id': postID, 'author': id, 'authorName': name, 'body': commentText }
exports.createComment = function(req, res){
    var msgObj = req.body;
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
        'body': msgObj.body
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
                        return res.json(500, {'error': error});
                    } else {
                        return res.json(200, {'success': 'Successfully added new comment.', 'comment': newComment});
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
                                        done(null, newComment);
                                    }
                                });
                            } else {
                                post.num_comment_pages += 1;

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
                    console.log('created new comment page.');
                    if(error){
                        return res.json(500, {'error': error});
                    } else {
                        console.log(newComment);
                        return res.json(200, {'success': 'Successfully added new comment.', 'comment': newComment});
                    }
                });
        }
    });

}

/*
// create function expects req.body to contain json object:
// { 'author': id, 'authorName': name, 'owner': id, 'body': string  }
exports.createComment = function(req, res){
    var msgObj = req.body;
    console.log(msgObj)

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.author){
        return res.json(400, {'error': 'Author is required.'});
    }

    if(!msgObj.authorName){
        return res.json(400, {'error': 'Author name is required.'});
    }

    if(!msgObj.owner){
        return res.json(400, {'error': 'Owner is required.'});
    }

    if(!msgObj.body){
        return res.json(400, {'error': 'Body is required.'});
    }

    Post.findById(msgObj.owner, function(error, post){
        if(error){
            return res.json(500, {'error': 'Server Error.', 'mongoError': error});
        } else if (!post){
            return res.json(400, {'error': 'No post with that owner ID'});
        } else {

            post.comments.push({
                'author': msgObj.author,
                'author_name': msgObj.authorName,
                'body': msgObj.body
            });

            post.save(function(error, post){
                if(error){
                    return res.json(500, {'error': 'Server Error.', 'mongoError': error});
                } else {
                    console.log('New comment created on post: ' + post.comments[post.comments.length - 1]);
                    return res.json(200, {'success': 'Successfully added new comment.', 'comment': post.comments[post.comments.length - 1]});
                }
            });
        }
    });
}

*/