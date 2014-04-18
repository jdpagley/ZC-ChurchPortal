/**
 * Created by Josh Pagley on 4/17/14.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Sub document Schemas
var commentSchema = require('./comment.js');
var likeSchema = require('./like.js');

/*
  owner: The church id that added the new sermon.
  title: Title of the sermon.
  series: The title of the current series that the sermon is part of.
  part: Which part of the series is the sermon, ie. 1,2,3,4,etc.
  speaker: The speaker of the sermon.
  notes: The notes of the sermon.
  audio: The URL to the sermon audio file.
  video: The URL to the sermon video file.
 */

var sermonSchema = new Schema({
    owner:                      {type: Schema.Types.ObjectId, ref: 'Church'},
    title:                      String,
    series:                     String,
    part:                       Number,
    speaker:                    String,
    notes:                      String,
    audio:                      String,
    video:                      String,
    comments:                   [commentSchema],
    createdAt:                  Date,
    updatedAt:                  Date
});

sermonSchema.pre('save', function(next){
    this.updatedAt = new Date();
    if (!this.createdAt){
        this.createdAt = new Date();
    }
    next();
});


module.exports = mongoose.model('Post', postSchema);