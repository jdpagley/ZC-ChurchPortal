/**
 * Created by Josh Pagley on 6/12/14.
 * Description: These are the http routes for the messaging service.
 */

var express = require('express'),
    messages = require('../controllers/messages.js');

module.exports = function(app){

    var messageRouter = express.Router();
    messageRouter.post('/api/zionconnect/v1/church/conversation', messages.createConversation);
    messageRouter.get('/api/zionconnect/v1/church/conversation', messages.retrieveConversations);
    messageRouter.delete('/api/zionconnect/v1/church/conversation', messages.deleteConversation);
    messageRouter.post('/api/zionconnect/v1/church/messages', messages.createMessage);
    messageRouter.delete('/api/zionconnect/v1/church/messages', messages.deleteMessage);

    app.use('/', messageRouter);
}