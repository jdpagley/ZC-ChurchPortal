/**
 * Created by Josh Pagley on 2/25/14.
 *
 * server/routes/portal.js will handle the routes that have to do with ZC Portal
 * ie. feed, settings, sermons, checkins, etc.
 */

var express = require('express'),
    churchs = require('../controllers/churchs.js'),
    posts = require('../controllers/posts.js'),
    sermons = require('../controllers/sermons.js'),
    checkins = require('../controllers/checkins.js'),
    member = require('../controllers/members.js'),
    notifications = require('../controllers/notifications.js');

module.exports = function(app) {
    //===========================================================
    //View Routes ===============================================
    //===========================================================
    var viewsRouter = express.Router();

    //Renders main index page for ZC Portal.
//    viewsRouter.get('/portal', isLoggedIn, function(req, res) {
//        res.render('portal/index', {
//            churchObject: req.user // get user out of session and pass to template
//        });
//    });

    viewsRouter.get('/portal', isLoggedIn, function(req, res) {
        return res.render('portal/index');
    });

    //Renders all the partial files in the ZC Portal.
    viewsRouter.get('/partials/*', isLoggedIn, function(req, res) {
        return res.render('../../public/app/' + req.params["0"]);
    });

    //===========================================================
    //Church Routes =============================================
    //===========================================================
    var churchRouter = express.Router();
    churchRouter.post('/api/zionconnect/v1/church', isLoggedIn, churchs.update); //Update Church Account Info.
    churchRouter.delete('/api/zionconnect/v1/church', isLoggedIn, churchs.delete);  //Delete church from ZC
    churchRouter.post('/api/zionconnect/v1/church/services', isLoggedIn, churchs.updateChurchServices); //Update Church Services
    churchRouter.post('/api/zionconnect/v1/church/reset', isLoggedIn, churchs.resetPassword); //Password Reset
    churchRouter.get('/api/zionconnect/v1/church/session', isLoggedIn, churchs.retrieveFromSession); //Retrieve church account from session

    //===========================================================
    //News Feed Post Routes =====================================
    //===========================================================
    var postsRouter = express.Router();
    postsRouter.get('/api/zionconnect/v1/church/posts', isLoggedIn, posts.retrieve);
    postsRouter.post('/api/zionconnect/v1/church/posts', isLoggedIn, posts.create);
    postsRouter.post('/api/zionconnect/v1/church/posts/comment', isLoggedIn, posts.createComment); //Create Comment on a Post

    //===========================================================
    //Sermon Routes =============================================
    //===========================================================
    var sermonRouter = express.Router();
    sermonRouter.post('/api/zionconnect/v1/church/sermon', isLoggedIn, sermons.create);
    sermonRouter.put('/api/zionconnect/v1/church/sermon', isLoggedIn, sermons.update);
    sermonRouter.get('/api/zionconnect/v1/church/sermon', isLoggedIn, sermons.retrieveSermonById);
    sermonRouter.get('/api/zionconnect/v1/church/sermon/list', isLoggedIn, sermons.retrieveAllSermons);
    sermonRouter.post('/api/zionconnect/v1/church/sermon/comment', isLoggedIn, sermons.createComment);
    sermonRouter.post('/api/zionconnect/v1/church/sermon/comment/like', isLoggedIn, sermons.likeSermonComment);

    //===========================================================
    //Checkin Routes ============================================
    //===========================================================
    var checkinRouter = express.Router();
    checkinRouter.get('/api/zionconnect/v1/church/checkins/service', isLoggedIn, checkins.retrieveCheckinsForServiceAndDateRange);
    checkinRouter.get('/api/zionconnect/v1/church/checkins',isLoggedIn, checkins.retrieveCheckinsForDateRange);

    //===========================================================
    //Member Routes =============================================
    //===========================================================
    var memberRouter = express.Router();
    memberRouter.get('/api/zionconnect/v1/church/members/all', isLoggedIn, member.retrieve);
    memberRouter.get('/api/zionconnect/v1/church/members', isLoggedIn, member.retrieveMemberById);

    //===========================================================
    //Notification Routes =======================================
    //===========================================================
    var notificationRouter = express.Router();
    notificationRouter.post('/api/zionconnect/v1/church/notification', isLoggedIn, notifications.create);


    // Require Routers
    app.use('/', viewsRouter);
    app.use('/', churchRouter);
    app.use('/', postsRouter);
    app.use('/', sermonRouter);
    app.use('/', checkinRouter);
    app.use('/', memberRouter);
    app.use('/', notificationRouter);


}

function isLoggedIn(req, res, next){
    //If user is logged in continue,
    //if not redirect to "/".
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/');
}
