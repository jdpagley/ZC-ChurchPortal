/**
 * Created by Josh Pagley on 2/25/14.
 */
/**
 This is the Feed Controller. This will handle any activity that has to do
 with the feed.
 */

angular.module('zcApp').controller('FeedController', ['$scope', '$window', 'zcIdentity', 'zcFeed', 'zcNotifications',
    function($scope, $window, zcIdentity, zcFeed, zcNotifications){

        //Current User Object
        $scope.currentUser = {};

        //Current Posts
        $scope.posts = [];

        //Retrieve Current User Object From Server
        if(!$scope.currentUser.email){
            var promise = zcIdentity.getIdentity();
            promise.then(function(result){
                //set currentUser with userObject returned from server.
                $scope.currentUser = result;

                //Retrieve Posts Associated With Current User ID.
                if($scope.currentUser._id && $scope.posts.length < 1){;
                    var promise;
                    promise = zcFeed.retrievePosts($scope.currentUser._id);
                    promise.then(function(result){
                        $scope.posts = result.posts;
                        console.log(result);
                    }, function(error){
                        console.log('Error: ' + error);
                    });
                }

            }, function(error){
                console.log('Error: ' + error);
            });
        }


        //Creating a new post on feed.

        //Object that view is binding to to create
        //new post on feed.
        $scope.newPostObj = {};

        $scope.createPost = function(){
            if($scope.currentUser._id && $scope.newPostObj.message !== ""){

                //Default properties for newPostObj for church.
                $scope.newPostObj['authorType'] = 'church';
                $scope.newPostObj['author'] = $scope.currentUser._id;
                $scope.newPostObj['owner'] = $scope.currentUser._id;
                $scope.newPostObj['authorName'] = $scope.currentUser.name;

                var promise = zcFeed.createPost($scope.newPostObj);

                promise.then(function(result){
                    $scope.posts.unshift(result.post);

                    $scope.newPostObj = {};
                }, function(error){
                    console.log('Error: ' + error);
                });
            }
        }

        //Add Comments To post
        $scope.newCommentObj = {};

        $scope.createComment = function(owner, index){
            var newCommentObj = {};

            newCommentObj['authorType'] = 'church';
            newCommentObj['author'] = $scope.currentUser._id;
            newCommentObj['authorName'] = $scope.currentUser.name;
            newCommentObj['owner'] = owner;
            //The view puts the comment body in the the newCommentObj key under the posts id.
            newCommentObj['body'] = $scope.newCommentObj[owner];

            console.log(newCommentObj);

            var promise = zcFeed.createComment(newCommentObj);

            promise.then(function(result){
                $scope.posts[index].comments.unshift(result.comment);

                var newNotification = {};
                newNotification['sender'] = $scope.currentUser._id;
                newNotification['recipient'] = owner;

                zcNotifications.createNotification()

                $scope.newCommentObj = {};
            }, function(error){
                console.log('Error: ' + error);
            });
        }

    }]);