/**
 * Created by Josh Pagley on 3/12/14.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    commentAuthor:              Schema.Types.ObjectId,
    commentRecipient:           {type: Schema.Types.ObjectId, ref: 'Post'},
    message:                    String,
    createdAt:                  Date
});

commentSchema.pre('save', function(next){
    if (!this.createdAt){
        this.createdAt = new Date();
    }

    next();
});


module.exports = mongoose.model('Comment', commentSchema);