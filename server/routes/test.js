/**
 * Created by Josh Pagley on 3/25/14.
 * Description: These are the routes to be used during testing.
 */

var churchs = require('../controllers/churchs.js');

module.exports = function(app) {
    //Make sure routes can only be accessed in development.
    if(process.env.NODE_ENV == "development"){

        //Church Routes.
        app.post('/api/zionconnect/tests/v1/church', churchs.update);
        app.del('/api/zionconnect/tests/v1/church', churchs.delete);
        app.put('/api/zionconnect/tests/v1/church', churchs.create);

        //Update Church Services
        app.post('/api/zionconnect/tests/v1/church/services', churchs.updateChurchServices);

        //Password Reset
        app.post('/api/zionconnect/tests/v1/church/reset', churchs.resetPassword);

        //route to retrieve churchObject from session
        app.get('/api/zionconnect/tests/v1/church/session', churchs.retrieveFromSession);

    }

}