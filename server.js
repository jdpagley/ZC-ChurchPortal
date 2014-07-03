var express = require('express'),
    passport = require('passport'),
    fs = require('fs'),
    app = express();

/**
 * Configure Socket.IO Server
 */
var server = require('http').Server(app);
var io = require('socket.io')(server);
//require('./server/config/socketIO')(io);

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./server/config/config')[env];

require('./server/config/express')(app, config);

require('./server/config/mongoose')(config);

require('./server/config/passport')(passport);

// Bootstrap Routes
var routes_path = __dirname + '/server/routes';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {;
        if(file === "socketIO.js"){
            require(routes_path + '/socketIO')(io);
        } else {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);
            if (stat.isFile()) {
                if (/(.*)\.(js$|coffee$)/.test(file)) {
                    require(newPath)(app, passport);
                }
                // We skip the app/routes/middlewares directory as it is meant to be
                // used and shared by routes as further middlewares and is not a
                // route by itself
            } else if (stat.isDirectory() && file !== 'middlewares') {
                walk(newPath);
            }
        }
    });
};
walk(routes_path);

//var Checkin = require('./server/models/checkin.js');
//
//for(var i = 0; i < 5; i++){
//    Checkin.create({'church':'534dec1e0fd8e3e3428a452d', member:'5363fa1c4cd782ea6d31942f', service:"Sunday 10:00 am", day:'4/24/2014', createdAt: new Date('4/24/2014')}, function(error, checkin){
//        if(error){
//            console.log('error');
//        } else {
//            console.log(checkin);
//        }
//    })
//}
//
//for(var i = 0; i < 5; i++){
//    Checkin.create({'church':'534dec1e0fd8e3e3428a452d', member:'5363fa1c4cd782ea6d31942f', service:"Sunday 10:00 am", day:'4/16/2014', createdAt: new Date('4/16/2014')}, function(error, checkin){
//        if(error){
//            console.log('error');
//        } else {
//            console.log(checkin);
//        }
//    })
//}

console.log('*** Environment is ' + process.env.NODE_ENV + '***');

server.listen(config.port);
console.log('Listening on port ' + config.port + '...');

module.exports = app;