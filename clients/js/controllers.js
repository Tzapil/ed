'use strict';

var app = angular.module('main');

app
  .controller('MenuController', ['$scope', '$location', function ($scope, $location) {
    $scope.item = $location.path().substring(1) || "home";

    $scope.isActive = function (item) {
      return $scope.item == item;
    }

    $scope.setActive = function (item) {
      $scope.item = item;
    }
  }])
  .controller('TabsController', ['$scope', function ($scope) {
    $scope.tab = 2;

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };
  }])
  .controller('UserController', ['$scope', '$http', function ($scope, $http) {
      $scope.headers = ["Name", "Email", "Department", "SSN"];
      $scope.propertyName = 'name';
      $scope.reverse = false;
      $scope.currentView = 'page1';

      $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
      };

      $scope.isSorted = function(property) {
        return $scope.propertyName == property;
      };

      $http.get('/data').then(function (answer) {
        $scope.users = answer.data;
      });
  }]);
