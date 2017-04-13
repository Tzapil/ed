'use strict';

var app = angular.module('main', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
      .when("/home", {
          templateUrl : "welcome.htm"
      })
      .when("/users", {
          templateUrl : "users.htm",
          controller : "UserController"
      })
      .otherwise({
        redirectTo: "/home"
      });
});
