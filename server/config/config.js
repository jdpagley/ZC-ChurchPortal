var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        db: 'mongodb://localhost/zionconnect',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    production: {
        rootPath: rootPath,
        db: 'mongodb://joshpagley:joshpagley@ds027729.mongolab.com:27729/zionconnect',
        port: process.env.PORT || 80
    }
}
