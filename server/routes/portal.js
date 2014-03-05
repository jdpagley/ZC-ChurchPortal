/**
 * Created by Josh Pagley on 2/25/14.
 *
 * server/routes/portal.js will handle the routes that have to do with ZC Portal
 * ie. feed, settings, sermons, checkins, etc.
 */

var churchs = require('../controllers/churchs.js');

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

    //Route to update church profile information.
    app.post('/church', isLoggedIn, function(req, res){
        churchs.update(req, res);
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
