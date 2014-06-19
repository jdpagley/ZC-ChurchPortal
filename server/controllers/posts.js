/**
 * Created by Josh Pagley on 4/3/14.
 */

var validator = require('validator');
var async = require('async');
var _ = require('underscore');

//Models
var Post = require('../models/post.js');

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

    if(!msgObj.body){
        return res.json(400, {'error': 'Post message required.'});
    }

    var newPost = {
        'author': msgObj.author,
        'owner': msgObj.owner,
        'body': msgObj.body
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

// create function expects req.body to contain json object:
// {'authorType': church, 'author': id, 'authorName': name, 'owner': id, 'body': string  }
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

