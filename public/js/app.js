'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('petRemoto', ['blogServices']);

var scp;
app.controller('AppCtrl', ['$scope', 'Post', 'Comment', function ($scope, Post, Comment) {
    scp = $scope;
    $scope.data = Post.query();

    $scope.postComment = function (post) {
        post.comment.postid = post._id;

        Comment.save(post.comment, function(data) {
            post.comments.push(data);
            post.comment = false;
            post.comment.nickname = "";
            post.comment.content = "";
        });
    };

    $scope.postPost = function (post) {
        Post.save(post, function(data) {
            $scope.data.posts.push(data);
        });
    };
}]);