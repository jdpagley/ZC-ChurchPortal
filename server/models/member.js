/**
 * Created by Josh Pagley on 5/2/14.
 */

var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var notificationTypes = ['post.comment', 'post.like', 'comment.like'];
var accountTypes = ['member', 'admin'];

//var memberSchema = new Schema({
//    type:                     String,
//    name:                     String,
//    email:                    {type: String, unique: true, required: true},
//    password:                 {type: String, required: true},
//    address:                  {
//        street:               String,
//        city:                 String,
//        state:                String,
//        zip:                  String
//    },
//    phone:                    String,
//    birthdate:                String,
//    gender:                   String,
//    relationshipStatus:       String,
//    bio:                      String,
//    interests:                [String],
//    memberships:              [{type: Schema.Types.ObjectId, ref: 'Church'}],
//    notifications:            {
//        author_type:          String,
//        author_member:        {type: Schema.Types.ObjectId, ref: 'Member'},
//        author_church:        {type: Schema.Types.ObjectId, ref: 'Church'},
//        message:              String,
//        type:                 {type: String, enum: notificationTypes},
//        post_id:              {type: Schema.Types.ObjectId, ref: 'Post'},
//        sermon_id:            {type: Schema.Types.ObjectId, ref: 'Sermon'},
//        sermon_comment_id:    Schema.Types.ObjectId
//    },
//    admin_of:                 [{type: Schema.Types.ObjectId, ref: 'Church'}],
//    createdAt:                Date,
//    updatedAt:                Date
//});

var memberSchema = new Schema({
    name:                     String,
    email:                    {type: String, unique: true, required: true},
    password:                 {type: String, required: true},
    profile:                  {
        avatar:                   String,
        address:                  {
            street:               String,
            city:                 String,
            state:                String,
            zip:                  String
        },
        phone:                    String,
        birthday:                 String,
        gender:                   String,
        relationshipStatus:       String,
        bio:                      String,
        interests:                [String]
    },
    metadata:                 {
        type:                     {type: String, enum: accountTypes},
        admin_of:                 [{type: Schema.Types.ObjectId, ref: 'Church'}],
        memberships:              [{type: Schema.Types.ObjectId, ref: 'Church'}],
        createdAt:                Date,
        updatedAt:                Date
    },
    notifications:            {
        author_type:          String,
        author_member:        {type: Schema.Types.ObjectId, ref: 'Member'},
        author_church:        {type: Schema.Types.ObjectId, ref: 'Church'},
        message:              String,
        type:                 {type: String, enum: notificationTypes},
        post_id:              {type: Schema.Types.ObjectId, ref: 'Post'},
        sermon_id:            {type: Schema.Types.ObjectId, ref: 'Sermon'},
        sermon_comment_id:    Schema.Types.ObjectId
    }
});

memberSchema.pre('save', function(next){
    this.metadata.updatedAt = new Date();
    if (!this.metadata.createdAt){
        this.metadata.createdAt = new Date();
    }

    next();
});

// methods ===========================

// generating a hash
memberSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
memberSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('Member', memberSchema);