/**
 * Created by Josh Pagley on 5/9/14.
 */


//Models
var Church = require('../models/church.js'),
    Member = require('../models/member.js');

//{'sender': senderID, 'senderName': name, 'recipient': recipientID, 'type': type, 'postID': optional, 'sermonID': optional, 'commentID': optional}
exports.create = function(req, res){
    var msgObj = req.body;

    if(!msgObj){
        return res.json(400, {'error': 'POST request must contain a body.'});
    }

    if(!msgObj.sender){
        return res.json(400, {'error': 'Sender id is required.'});
    }

    if(!msgObj.senderName){
        return res.json(400, {'error': 'Sender name is required.'});
    }

    if(!msgObj.recipient){
        return res.json(400, {'error': 'Recipient id is required.'});
    }


    if(!msgObj.type){
        return res.json(400, {'error': 'Notification type is required.'});
    }

    if(!msgObj.postID || !msgObj.sermonID && !msgObj.sermonCommentID){
        return res.json(400, {'error': 'Post ID is required or sermon ID and sermon comment ID is required.'});
    }

    Member.findById(msgObj.recipient, function(error, member){
        if(error){
            return res.json(500, {'error': "Server Error", 'mongoError': error});
        } else if(!member) {
            return res.json(400, {'error': 'No recipient account with that id address.'});
        } else {
            switch (msgObj.type){
                case 'post.like':
                    var newNotification = {
                        type: 'post.like',
                        author_type: 'church',
                        author_church: msgObj.sender,
                        message: msgObj.senderName + ' liked your post.',
                        post_id: msgObj.postID
                    }
                    member.notifications.push(newNotification);
                    member.save(function(error){
                        if(error){
                            return res.json(500, {'error': "Server Error", 'mongoError': error});
                        } else {
                            return res.json(200, {'success': 'Created new post.like notification.'});
                        }
                    });
                    break;
                case 'post.comment':
                    var newNotification = {
                        type: 'post.like',
                        author_type: 'church',
                        author_church: msgObj.sender,
                        message: msgObj.senderName + ' commented on your post.',
                        post_id: msgObj.postID
                    }
                    member.notifications.push(newNotification);
                    member.save(function(error){
                        if(error){
                            return res.json(500, {'error': "Server Error", 'mongoError': error});
                        } else {
                            return res.json(200, {'success': 'Created new post.comment notification.'});
                        }
                    });
                    break;
                case 'comment.like':
                    var newNotification = {
                        type: 'post.like',
                        author_type: 'church',
                        author_church: msgObj.sender,
                        message: msgObj.senderName + ' liked your comment.',
                        sermon_id: msgObj.sermonID,
                        sermon_comment_id: msgObj.sermonCommentID
                    }
                    member.notifications.push(newNotification);
                    member.save(function(error){
                        if(error){
                            return res.json(500, {'error': "Server Error", 'mongoError': error});
                        } else {
                            return res.json(200, {'success': 'Created new comment.like notification.'});
                        }
                    });
                    break;
                default :
                    res.json(400, {'error': 'No action for notification with that type.'});
                    break;
            }
        }
    })
}