/**
 * Created by Josh Pagley on 4/15/14.
 */

var async = require('async');

//Models
var Post = require('../models/post.js');

// create function expects req.body to contain json object:
// {'authorType': church, 'author': id, 'authorName': name, 'owner': id, 'body': string  }
exports.create = function(req, res){
    var msgObj = req.body;
    console.log(msgObj)

    if(!msgObj){
        return res.json(400, {'error': 'POST body is required.'});
    }

    if(!msgObj.authorType){
        return res.json(400, {'error': 'Author Type is required.'});
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

            console.log('post: ' + JSON.stringify(post));

            post.comments.push({
                'authorType': msgObj.authorType,
                'author_church': msgObj.author,
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