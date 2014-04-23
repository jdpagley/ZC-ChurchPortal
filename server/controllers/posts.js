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

    if(!msgObj.authorType){
        return res.json(400, {'error': 'authorType required.'});
    }

    if(!msgObj.author){
        return res.json(400, {'error': 'postAuthor required.'});
    }

    if(!msgObj.authorName){
        return res.json(400, {'error': 'post name required.'});
    }

    if(!msgObj.owner){
        return res.json(400, {'error': 'postRecipient required.'});
    }

    if(!msgObj.body){
        return res.json(400, {'error': 'Post message required.'});
    }

    var newPost = {
        'author_type': msgObj.authorType,
        'author_church': msgObj.author,
        'author_name': msgObj.authorName,
        'owner': msgObj.owner,
        'body': msgObj.body
    }

    Post.create(newPost, function(error, post){
        if(error){
            return res.json(500, {'error': 'Server Error', 'mongoError': error});
        } else {
            console.log('new post: ' + post);
            return res.json(200, {'success': 'Successfully created new post.', 'post': post});
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
            {path: 'author_church'}
        ];

        Post.find({'owner': msgObj.churchID}).populate(options).sort({'createdAt': -1}).exec(function(error, posts){
            if(error){
                console.log(error);
                return res.json(500, {'error': 'Server Error', 'mongoError': error});
            } else {
                console.log(posts);
                //reverse the order of the comments in the array.
                res.json(200, {'success': 'Successfully retrieved posts.', 'posts': posts});
                return;
            }
        })
    }
}

