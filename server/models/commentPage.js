/**
 * Created by Josh Pagley on 6/30/14.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Sub document Schemas
var commentSchema = require('./comment.js');

var commentPageSchema = new Schema({
    node_id:            {type: Schema.Types.ObjectId, ref: 'Post'},
    page:               Number,
    count:              Number,
    comments:          [commentSchema]
});

module.exports = mongoose.model('Comment_Page', commentPageSchema);