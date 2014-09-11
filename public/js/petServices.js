/**
 * Created by matheus on 01/09/2014.
 */
var blogServices = angular.module('blogServices', ['ngResource']);

blogServices.factory('Post', ['$resource',
    function($resource) {
        return $resource('post/:postId', {postId: '@postid'}, {
            'query':  {method:'GET', isArray:false}
        });
    }]);

blogServices.factory('Comment', ['$resource',
    function($resource) {
        return $resource('post/:postId/comment/:commentId', {postId: '@postid', commentId: '@commentid'});
    }]);