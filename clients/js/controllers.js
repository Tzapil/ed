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
    $scope.tab = 1;

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };

    // Sort
    $scope.sort = {
      propertyName : 'name',
      reverse : false
    };

    $scope.sortBy = function(propertyName) {
      $scope.sort.reverse = ($scope.sort.propertyName === propertyName) ? !$scope.sort.reverse : false;
      $scope.sort.propertyName = propertyName;
    };

    $scope.isSorted = function(property) {
      return $scope.sort.propertyName == property;
    };
  }])
  .controller('UserController', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
      $scope.headers = ["Name", "Email", "Department", "Telephone"];
      $scope.users = [];
      $scope.filtered = [];
      $scope.groups = [];
      $scope.currentView = 'page1';

      $scope.filterUsers = function () {
        return $filter('filter')($scope.users, $scope.searchName) || [];
      }

      $scope.addVirtual = function (users) {
        for(var i = 0; i < users.length; i++) {
           var item = users[i];
           item.name = item.first_name + ' ' + item.last_name;
           item.telephone = "+123(456)123-45-76";
        }
      }

      $scope.collectGroups = function (users) {
        var result = [];
        var temp = {};
        for(var i = 0; i < users.length; i++) {
           var item = users[i];
           if (!temp[item.group]) {
             temp[item.group] = [];
             result.push({
               name: item.group,
               items: temp[item.group]
             })
           }
           temp[item.group].push(item);
        }

        return result;
      }

      $http({
        url: 'https://puu.sh/vm7w2/4947ae7169.json',
        method: 'GET'
      }).then(function (answer) {
        $scope.users = answer.data;

        $scope.filtered = $scope.filterUsers();
        $scope.addVirtual($scope.filtered);
        $scope.groups = $scope.collectGroups($scope.filtered);
      });

      $scope.$watch('searchName', function (newVal, oldVal) {
        $scope.filtered = $scope.filterUsers();
        $scope.addVirtual($scope.filtered);
        $scope.groups = $scope.collectGroups($scope.filtered);
    	}, true);
  }])
  .controller('PagingController', ['$scope', '$filter', function ($scope, $filter) {
    // Pagination
    $scope.gap = 5;

    $scope.filteredItems = [];
    $scope.itemsPerPage = 12;
    $scope.pagedItems = [];

    $scope.currentPage = 1;

    $scope.$watch('sort', function (newVal, oldVal) {
      $scope.search();
  	}, true);

    $scope.$watch('searchName', function (newVal, oldVal) {
  		$scope.currentPage = 1;

      $scope.search();
  	}, true);

    $scope.$watch('users', function (newVal, oldVal) {
  		$scope.currentPage = 1;

      $scope.search();
  	}, true);

    $scope.search = function () {
      // take care of the sorting order
      if ($scope.sort.propertyName !== '') {
        $scope.filteredItems = $filter('orderBy')($scope.filtered, $scope.sort.propertyName, $scope.sort.reverse);
      }
      // now group by pages`
      $scope.groupToPages();
    };

    // calculate page in place
    $scope.groupToPages = function () {
      $scope.pagedItems = [];

      for (var i = 0; i < $scope.filteredItems.length; i++) {
        if (i % $scope.itemsPerPage === 0) {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
        } else {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
        }
      }
    };

    $scope.range = function (size, start, end) {
      var result = [];

      if (size < end) {
        end = size;
        start = size - $scope.gap;
      }
      for (var i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    };

    $scope.setPage = function (page) {
      $scope.currentPage = page;
    };
  }]);
