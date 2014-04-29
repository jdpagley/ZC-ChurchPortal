/**
 * Created by Josh Pagley on 4/29/14.
 */


var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var likeSchema = require('./like.js');

var authorTypes = ['church', 'member'];

/*
 author_type: they type of account that created the comment - church or member.
 author_church: the id of the church if it authored the comment.
 author_member: the id of the member if he/she authored the comment.
 author_name: the name of the member/church that authored the comment.
 body: the body of the comment.
 */

var sermonCommentSchema = new Schema({
    author_type:                {type: String, enum: authorTypes},
    author_church:              {type: Schema.Types.ObjectId, ref: 'Church'},
    author_member:              {type: Schema.Types.ObjectId, ref: 'Member'},
    author_name:                String,
    body:                       String,
    likes:                      [likeSchema],
    createdAt:                  Date
});

sermonCommentSchema.pre('save', function(next){
    if (!this.createdAt){
        this.createdAt = new Date();
    }
    next();
});



module.exports = sermonCommentSchema;