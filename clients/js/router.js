var app = angular.module("myApp", ["ngRoute"]);
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
