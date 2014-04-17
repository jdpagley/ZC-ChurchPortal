/**
 * Created by Josh Pagley on 2/25/14.
 *
 * server/routes/portal.js will handle the routes that have to do with ZC Portal
 * ie. feed, settings, sermons, checkins, etc.
 */

var churchs = require('../controllers/churchs.js');
var posts = require('../controllers/posts.js');
var comments = require('../controllers/comments.js');

module.exports = function(app) {

    //Renders main index page for ZC Portal.
    //Defaults to News Feed as starting page.
    app.get('/portal', isLoggedIn, function(req, res) {
        res.render('portal/index', {
            churchObject: req.user // get user out of session and pass to template
        });
    });

    //Renders all the partial files in the ZC Portal.
    //ie. News Feed, Settings, Check-ins and Sermon pages.
    app.get('/partials/*', isLoggedIn, function(req, res) {
        res.render('../../public/app/' + req.params);
    });

    //Church Routes.
    app.post('/api/zionconnect/v1/church', isLoggedIn, churchs.update);
    app.del('/api/zionconnect/v1/church', isLoggedIn, churchs.delete);

    //Update Church Services
    app.post('/api/zionconnect/v1/church/services', isLoggedIn, churchs.updateChurchServices);

    //Password Reset
    app.post('/api/zionconnect/v1/church/reset', isLoggedIn, churchs.resetPassword);

    //route to retrieve churchObject from session
    app.get('/api/zionconnect/v1/church/session', isLoggedIn, churchs.retrieveFromSession);

    //Post Routes
    app.get('/api/zionconnect/v1/church/posts', isLoggedIn, posts.retrieve);
    app.post('/api/zionconnect/v1/church/posts', isLoggedIn, posts.create);

    //Comment Routes
    app.post('/api/zionconnect/v1/church/posts/comment', isLoggedIn, comments.create);



}

// route middleware to make sure user is logged in.
function isLoggedIn(req, res, next){
    //if user is logged in the session, carry on
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/');
}
