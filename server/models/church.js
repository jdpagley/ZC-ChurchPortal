/**
 * Created by admin on 12/5/13.
 *
 * 1. Services Need to be added. This will restrict the user to be able to check in only
 *    when its a valid church service for that church.
 */

var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var churchSchema = new Schema({
    name:                     String,
    email:                    String,
    password:                 String,
    address:                  {
        street:               String,
        city:                 String,
        state:                String,
        zip:                  String
    },
    phone:                    String,
    website:                  String,
    bio:                      String,
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
