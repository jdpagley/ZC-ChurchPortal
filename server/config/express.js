// morgan: This is the module used for logging.


var express = require('express'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    passport = require('passport'),
    flash = require("connect-flash");

module.exports = function(app, config) {

    app.set('views', config.rootPath + 'server/views');
    app.set('view engine', 'ejs');
    app.use(morgan('dev'));
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(bodyParser());
    app.use(session({secret: 'zionconnectsecretholdsthekey'}));
    app.use(passport.initialize());
    app.use(passport.session({
        secret: '91044062-5A2B-444F-8E49-ED77388D89C8'
    }));
    app.use(flash());
    app.use(express.static(config.rootPath + '/public'));

}