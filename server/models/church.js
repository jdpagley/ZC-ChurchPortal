/**
 * Created by admin on 12/5/13.
 *
 * 1. Services Need to be added. This will restrict the user to be able to check in only
 *    when its a valid church service for that church.
 */

var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var notificationTypes = ['post.comment', 'post.like', 'comment.like'];

var churchSchema = new Schema({
    name:                     String,
    email:                    {type: String, unique: true, required: true},
    password:                 {type: String, required: true},
    address:                  {
        street:               String,
        city:                 String,
        state:                String,
        zip:                  String
    },
    phone:                    String,
    website:                  String,
    bio:                      String,
    notifications:            {
        author_type:          String,
        author_member:        {type: Schema.Types.ObjectId, ref: 'Member'},
        author_church:        {type: Schema.Types.ObjectId, ref: 'Church'},
        type:                 {type: String, enum: notificationTypes},
        message:              String,
        post_id:              {type: Schema.Types.ObjectId, ref: 'Post'},
        sermon_id:            {type: Schema.Types.ObjectId, ref: 'Sermon'},
        sermon_comment_id:    Schema.Types.ObjectId
    },
    services:                 [{
        day:                  String,
        time:                 String
    }],
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

// methods ===========================

// generating a hash
churchSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
churchSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Church', churchSchema);
