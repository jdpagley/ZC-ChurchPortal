/**
 * Created by Josh Pagley on 3/12/14.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/*
 author_type: they type of account that created the comment - church or member.
 author_church: the id of the church if it authored the comment.
 author_member: the id of the member if he/she authored the comment.
 author_name: the name of the member/church that authored the comment.
 body: the body of the comment.
 */

var likeSchema = new Schema({
    author_church:           {type: Schema.Types.ObjectId, ref: 'Church'},
    author_member:           {type: Schema.Types.ObjectId, ref: 'Member'},
    author_name:             String,
    createdAt:               Date
});

likeSchema.pre('save', function(next){
    if (!this.createdAt){
        this.createdAt = new Date();
    }
    next();
});


module.exports = likeSchema;