var app = angular.module('app.services', [])

    .factory('$dictionary', function () {
      var $dictionary;

      $dictionary = {
        getNameForValue: function (dictionaryName, value) {
          var dictionary = $dictionary[dictionaryName];

          if (dictionary) {
            dictionary.forEach(function (item) {
              if (item.value === value) {
                return item.name;
              }
            });
          }
        },
        getValueForName: function (dictionaryName, name) {
          var dictionary = $dictionary[dictionaryName];

          if (dictionary) {
            dictionary.forEach(function (item) {
              if (item.name === name) {
                return item.value;
              }
            });
          }
        },
        priorities: [
          {name: 'Low', value: 0},
          {name: 'Medium', value: 1},
          {name: 'High', value: 2},
          {name: 'Critical', value: 3}
        ],
        dates: [
          {name: 'Today', value: 'today'},
          {name: 'Tomorrow', value: 'tomorrow'},
          {name: 'Next Week', value: 'nextweek'},
          {name: 'Someday', value: 'nextmonth'}
        ],
        repeats: [
          {name: 'None', value: null},
          {name: 'Every Day', value: 'daily'},
          {name: 'Every Week', value: 'weekly'},
          {name: 'Every Month', value: 'monthly'},
          {name: 'Every Year', value: 'yearly'}
        ],
        hours: [
          {name: '+1', value: 1},
          {name: '+2', value: 2},
          {name: '+4', value: 4},
          {name: '+8', value: 8}
        ],
        filters: [
          {name: 'Today', value: 'today'},
          {name: 'Tomorrow', value: 'tomorrow'},
          {name: 'Next 7 days', value: 'week'},
          {name: 'All tasks', value: 'all'},
          {name: 'Completed', value: 'done'}
        ],
        sorts: [
          {name: 'By Name', value: '+name'},
          {name: 'By Date', value: '+date'},
          {name: 'By Priority', value: '-priority'}
        ],
        colors: [
          {name: 'white', value: 'white'},
          {name: 'blue', value: 'rgba(17,120,200,1)'},
          {name: 'red', value: '#ca5b45'}
        ]
      };

      return $dictionary;
    });