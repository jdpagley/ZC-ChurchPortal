/**
 * Created by Josh Pagley on 5/15/14.
 * Description: Used for the members array of
 * the conversation schema.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var authorTypes = ['church', 'member'];

/*
 author_type: they type of account that created the comment - church or member.
 author_church: the id of the church if it authored the comment.
 author_member: the id of the member if he/she authored the comment.
 author_name: the name of the member/church that authored the comment.
 */

var conversationMemberSchema = new Schema({
    account_type:                {type: String, enum: authorTypes},
    account_church:              {type: Schema.Types.ObjectId, ref: 'Church'},
    account_member:              {type: Schema.Types.ObjectId, ref: 'Member'},
    account_name:                String
});


module.exports = conversationMemberSchema;
