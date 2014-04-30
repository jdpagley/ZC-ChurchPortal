/**
 * Created by Josh Pagley on 4/23/14.
 */

angular.module('zcApp').controller('SermonHomeController', ['$scope', '$routeParams', 'zcIdentity', 'zcSermons',
    function($scope, $routeParams, zcIdentity, zcSermons){
        //Current User Object
        $scope.currentUser = {};

        //Sermon List
        $scope.sermon = null;

        //Retrieve User Profile From Server On Page Refresh
        if(!$scope.currentUser.email){
            var promise;
            promise = zcIdentity.getIdentity();
            promise.then(function(result){
                $scope.currentUser = result;
            }, function(error){
                console.log(error);
            });
        }

        //Retrieve Sermon Associated With Sermon ID In URL Parameters.
        if(!$scope.sermon){
            var promise;
            promise = zcSermons.retrieveSermonById($routeParams.id);
            promise.then(function(result){
                $scope.sermon = result.sermon;
            }, function(error){
                console.log(error);
            });
        }

        //Add Comments To post
        $scope.newCommentObj = {};

        $scope.createComment = function(owner){
            var newCommentObj = {};

            newCommentObj['authorType'] = 'church';
            newCommentObj['author'] = $scope.currentUser._id;
            newCommentObj['authorName'] = $scope.currentUser.name;
            newCommentObj['owner'] = owner;
            //The view puts the comment body in the the newCommentObj key under the posts id.
            newCommentObj['body'] = $scope.newCommentObj.body;

            console.log(newCommentObj);

            var promise = zcSermons.createComment(newCommentObj);

            promise.then(function(result){
                $scope.sermon.comments.unshift(result.comment);
                console.log(result);
                $scope.newCommentObj = {};
            }, function(error){
                console.log(error);
            });
        }

        //Like A Sermon Comment.
        $scope.likeComment = function(sermonId, commentId, index){
            var newLikeObj = {};

            newLikeObj['sermonId'] = sermonId;
            newLikeObj['commentId'] = commentId;
            newLikeObj['author'] = $scope.currentUser._id;
            newLikeObj['authorName'] = $scope.currentUser.name;

            console.log(newLikeObj);

            console.log(index);

            var promise = zcSermons.likeComment(newLikeObj);

            promise.then(function(result){
                $scope.sermon.comments[index].likes.push(result.like);
                console.log(result);
            }, function(error){
                console.log(error);
            });

        }
    }]);