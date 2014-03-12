/**
 * Created by Josh Pagley on 2/25/14.
 */
/**
 This is the Feed Controller. This will handle any activity that has to do
 with the feed.
 */

angular.module('zcApp').controller('FeedCtrl', ['$scope', '$window', 'zcIdentity',
    function($scope, $window, zcIdentity){

        //Current User Object
        $scope.currentUser = {};


        if(!$scope.currentUser.email){
            var defer;
            defer = zcIdentity.getIdentity();
            defer.then(function(result){
                $scope.currentUser = result;
            }, function(error){
                console.log('Error: ' + error);
            });
        }

        console.log('currentUser in FeedCtrl: ');
        console.log($scope.currentUser);

        $scope.posts = [{
            user: 'Josh Pagley',
            message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
            date: new Date(2013, 10, 20),
            comments: [{
                user: 'Bill Joe',
                message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
                date: new Date(2013, 10, 20),
            },{
                user: 'Hannah Smith',
                message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
                date: new Date(2013, 10, 20),
            },{
                user: 'Tim Allen',
                message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
                date: new Date(2013, 10, 20),
            }]
        },{
            user: 'John Pagley',
            message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
            date: new Date(2013, 10, 10),
            comments: [{
                user: 'Bill Joe',
                message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
                date: new Date(2013, 10, 20),
            },{
                user: 'Hannah Smith',
                message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
                date: new Date(2013, 10, 20),
            }]
        },{
            user: 'Jeff Pagley',
            message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
            date: new Date(2013, 11, 20),
            comments: [{
                user: 'Bill Joe',
                message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
                date: new Date(2013, 10, 20),
            },{
                user: 'Hannah Smith',
                message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
                date: new Date(2013, 10, 20),
            },{
                user: 'Tim Allen',
                message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
                date: new Date(2013, 10, 20),
            }]
        },{
            user: 'Jeremy Pagley',
            message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
            date: new Date(2013, 9, 20)
        },{
            user: 'mariah Pagley',
            message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
            date: new Date(2014, 1, 20),
            comments: [{
                user: 'Bill Joe',
                message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
                date: new Date(2013, 10, 20),
            },{
                user: 'Hannah Smith',
                message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
                date: new Date(2013, 10, 20),
            },{
                user: 'Tim Allen',
                message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
                date: new Date(2013, 10, 20),
            },{
                user: 'Tim Allen',
                message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
                date: new Date(2013, 10, 20),
            },{
                user: 'Tim Allen',
                message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
                date: new Date(2013, 10, 20),
            }]
        },{
            user: 'Marisa Pagley',
            message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
            date: new Date(2014, 2, 10)
        },{
            user: 'Malia Pagley',
            message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
            date: new Date(2014, 1, 22)
        },{
            user: 'Kaitlin Pagley',
            message: 'This is just an example message from me. I love to code and do awesome stuff in tech.',
            date: new Date()
        }];
    }]);