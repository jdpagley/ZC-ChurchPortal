/**
 * Created by Josh Pagley on 2/26/14.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Sub document Schemas
var commentSchema = require('./comment.js');
var likeSchema = require('./like.js');

/*
 author_type: they type of account that created the post - church or member.
 author_church: the id of the church if it authored the post.
 author_member: the id of the member if he/she authored the post.
 author_name: the name of the member/church that authored the post.
 owner: the owner is the id of a church.
 body: the body of the post.
 */

var authorTypes = ['church', 'member'];

var postSchema = new Schema({
    author_type:                {type: String, enum: authorTypes},
    author_church:              {type: Schema.Types.ObjectId, ref: 'Church'},
    author_member:              {type: Schema.Types.ObjectId, ref: 'Member'},
    author_name:                String,
    owner:                      {type: Schema.Types.ObjectId, ref: 'Church'},
    comments:                   [commentSchema],
    likes:                      [likeSchema],
    body:                       String,
    createdAt:                  Date,
    updatedAt:                  Date
});

postSchema.pre('save', function(next){
    this.updatedAt = new Date();
    if (!this.createdAt){
        this.createdAt = new Date();
    }
    next();
});


module.exports = mongoose.model('Post', postSchema);