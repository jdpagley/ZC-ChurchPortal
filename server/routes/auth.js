/**
 * Created by Josh Pagley on 2/22/14.
 * Description:
 * Auth routes control all authentication operations for the portal
 */

var express = require('express');

module.exports = function(app, passport){

    var authenticationRouter = express.Router();

    //========================================================
    // Signup ================================================
    //========================================================
    authenticationRouter.get('/signup', isAuthorizedToViewProfile, function(req, res){
        res.render('website/signup.ejs', {message: req.flash('signupMessage')} );
    });

    //process the signup form
    authenticationRouter.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/portal',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    //========================================================
    // Login =================================================
    //========================================================
    authenticationRouter.get('/login', isAuthorizedToViewProfile, function(req, res){
        res.render('website/login.ejs', {message: req.flash('loginMessage')});
    });

    authenticationRouter.post('/login', passport.authenticate('local-login', {
        successRedirect: '/portal',
        failureRedirect: '/login',
        failureFlash: true
    }));

    //========================================================
    // Logout ================================================
    //========================================================
    authenticationRouter.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.use('/', authenticationRouter);
}

function isAuthorizedToViewProfile(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/portal');
    }

    return next();
}