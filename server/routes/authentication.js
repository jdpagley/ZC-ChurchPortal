/**
 * Created by Josh Pagley on 2/22/14.
 */

module.exports = function(app, passport){

    app.get('/profile', isLoggedIn, function(req, res){
        res.render('profile.ejs', {
            user: req.user // get user out of session and pass to template
        });
    });

    // Signup ==============================
    app.get('/signup', isAuthorizedToViewProfile, function(req, res){
        res.render('website/signup.ejs', {message: req.flash('signupMessage')} );
    });

    //process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/portal',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    // Login ===============================
    app.get('/login', isAuthorizedToViewProfile, function(req, res){
        res.render('website/login.ejs', {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/portal',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
}

// route middleware to make sure user is logged in.
function isLoggedIn(req, res, next){
    //if user is logged in the session, carry on
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/');
}

function isAuthorizedToViewProfile(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/portal');
    }

    return next();
}