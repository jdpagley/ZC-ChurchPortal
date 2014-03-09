var express = require('express'),
    passport = require('passport'),
    flash = require("connect-flash");

module.exports = function(app, config) {

    app.configure(function() {
        app.set('views', config.rootPath + '/server/views');
        app.set('view engine', 'ejs');
        app.use(express.logger('dev'));
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.session({secret: 'multi vision unicorns'}));
        app.use(passport.initialize());
        app.use(passport.session({
            secret: '91044062-5A2B-444F-8E49-ED77388D89C8'
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());
        app.use(express.static(config.rootPath + '/public'));
    });
}