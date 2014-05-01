/**
 * Website.js handles all the routes for the regular zionconnect.com website.
 */

var express = require('express');

module.exports = function(app) {

    var websiteRouter = express.Router();

    websiteRouter.all('/api/*', function(req, res) {
        res.send(404);
    });

    websiteRouter.get('/church', function(req, res) {
        res.render('website/church', {title: "Welcome to the church.ejs page!!"});
    });

    websiteRouter.get('/member', function(req, res) {
        res.render('website/member', {title: "Welcome to the member.ejs page!!"});
    });

    websiteRouter.get('*', function(req, res) {
        res.render('website/index', {title: "Welcome to the index.ejs page!!"});
    });

    app.use('/', websiteRouter);
}