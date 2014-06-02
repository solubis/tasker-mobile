angular.module('app.filters', [])

    .filter('priority', function ($dictionary) {
      return function (input) {
        return $dictionary.priorities[input].name;
      }
    })

    .filter('color', function ($dictionary) {
      return function (input) {
        var color = $dictionary.colors[input] ||  $dictionary.colors[0];
        return color.value;
      }
    })

    .filter('groupBy', function ($dictionary, $filter) {
      return function (items, field) {
        var groupedList = [],
            previousItem = null,
            isGroupChange = false;

        angular.forEach(items, function (item) {
          isGroupChange = false;

          if (previousItem !== null) {
            if (!angular.equals(previousItem[field], item[field])) {
              isGroupChange = true;
            }
          } else {
            isGroupChange = true;
          }

          if (isGroupChange) {
            switch (field) {
              case 'priority':
                item.groupHeader = $dictionary.priorities[item.priority].name;
                break;
              case 'date':
                item.groupHeader = $filter('date')(item.date, 'dd MMMM yyyy');
                break;
              default:
                item.groupHeader = undefined;
                break;
            }
          } else {
            item.groupHeader = undefined;
          }

          groupedList.push(item);
          previousItem = item;
        });

        return groupedList;
      };
    })

    .filter('dateUntil', function () {
      return function (items, period) {
        var today,
            tomorrow,
            yesterday,
            week,
            filteredItems;

        if (!items) {
          return [];
        }

        today = new Date();
        today.setHours(23);
        today.setMinutes(59);
        today.setSeconds(59);

        function shiftDate(date, days) {
          var _date = new Date(date.valueOf());

          _date.setDate(date.getDate() + days);

          return _date.getTime();
        }

        tomorrow = shiftDate(today, 1);
        yesterday = shiftDate(today, -1);
        week = shiftDate(today, 7);

        filteredItems = items.filter(function (item) {
          var time;

          if (!item.date) {
            return period === 'all';
          }

          time = item.date;

          switch (period) {
            case 'today':
              return yesterday < time && time <= today;
            case 'tomorrow':
              return yesterday < time && time <= tomorrow;
            case 'week':
              return yesterday < time && time <= week;
            default:
              return true;
          }
        });

        return filteredItems;
      };
    });