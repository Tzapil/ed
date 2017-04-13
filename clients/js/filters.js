'use strict';

var app = angular.module('main');

app.filter('fullname', function() {
    return function(items) {
        for(var i = 0; i < items.length; i++) {
           var item = items[i];
           item.name = item.first_name + ' ' + item.last_name;

        }
        return items;
    }
})
