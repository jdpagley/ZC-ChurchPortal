//To start MongoDB on windows when it has been setup as a service
// use "net start MongoDB" and to stop "net stop MongoDB".
// Parentheses are not actually included in commands.

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
