/**
 * Created by Josh Pagley on 2/26/14.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var postSchema = new Schema({
    postedBy:                 String,
    createdAt:                Date,
    UpdatedAt:                Date
});

churchSchema.pre('save', function(next){
    this.updatedAt = new Date();
    if (!this.createdAt){
        this.createdAt = new Date();
    }

    next();
});


module.exports = mongoose.model('Post', postSchema);