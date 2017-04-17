'use strict';

var app = angular.module('main', ["ngRoute", 'bw.paging']);

app.config(function($routeProvider) {
    $routeProvider
      .when("/home", {
          templateUrl : "welcome.htm"
      })
      .when("/users", {
          templateUrl : "users.htm"
      })
      .otherwise({
        redirectTo: "/home"
      });
});
