/**
 * Created by Josh Pagley on 6/12/14.
 *
 * Live Messaging is on hold for the time being due to the fact that we have no member client app to test it with.
 * We will continue development on the live messaging once client app is ready for live messaging stage also.
 *
 * DESIGN PLAN:
 * We will have each socket joined to the room created with a room name of the member id that
 * just connected with that socket. The socket information will be stored in redis so that the
 * traffic can be distributed across multiple servers. By having the sockets in a room under the
 * member ids we will be able to easily ask redis for the socket of the specified member and emit
 * a event (ie message, new conversation, etc.) to that socket.
 *
 * Members/Church will only have a socket in redis when they are online. When they come offline their
 * socket will be removed from the redis store. Before emitting to the socket we will check to see if it
 * exists in redis. If it does we will perform the server actions necessary and also emit it to the client
 * socket. If it does not exist we will just perform the server actions and send out the push notification.
 */

module.exports = function(io){
    io.on('connection', function(socket){
        console.log(socket.id);
    });
}