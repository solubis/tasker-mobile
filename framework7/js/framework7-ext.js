angular.module('framework7', [])

    .directive('view', function ($app) {
      return {
        restrict: 'C',
        link: function (scope, element, attrs) {
          $app.addView(element, {
            dynamicNavbar: attrs.dynamicNavbar || true,
            domCache: attrs.domCache || true,
            linksView: attrs.linksView,
            subEvents: attrs.subEvents
          });
        }
      };
    })

    .directive('page', function () {
      return {
        restrict: 'C',
        scope: true,
        link: function (scope, element, attrs, ctrl) {
        }
      };
    })

    .directive('itemLink', function ($navigator) {
      return {
        restrict: 'C',
        link: function (scope, element) {
          element.on('click', function () {
            $navigator.setScope(element.scope());
          });
        }
      };
    })

    .directive('pullToRefreshContent', function ($app) {
      return {
        restrict: 'C',
        controller: function ($scope, $element, $attrs) {
        },
        link: function (scope, element) {
          element.on('refresh', function () {
            scope.populate().then(function () {
              $app.pullToRefreshDone(element);
            });
          });
        }
      };
    })

    .provider('$navigator', function () {
      var _config = {},
          _scope, _view;

      this.page = function (name, config) {
        _config[name] = config;
      };

      this.$get = function () {
        var nav;

        nav = {
          getPageConfig: function (name) {
            return _config[name];
          },
          setScope: function (scope) {
            _scope = scope.$new();
          },
          getScope: function () {
            return _scope;
          },
          setView: function (view) {
            _view = view;
          },
          goBack: function () {
            _view.goBack();
          }
        };

        return nav;
      }
    })

    .factory('$app', function ($navigator, $compile, $controller, $timeout, $injector) {
      var app;

      function compile(pageName, container) {
        var config,
            scope,
            controller;

        config = $navigator.getPageConfig(pageName);

        if (!config) {
          console.log('Skipping compile for page', pageName);
          return;
        }

        scope = $navigator.getScope();

        controller = config.controller;

        if (controller) {
          $controller(controller, {$scope: scope});
        }

        container = angular.element(container);

        $compile(container)(scope);

        scope.$digest();
      }

      Framework7.prototype.plugins.demoPlugin = function (app, params) {
        return {
          hooks: {
            navbarInit: function (navbar, pageData) {
              compile(pageData.name, navbar.container);
            },
            pageInit: function (pageData) {
              compile(pageData.name, pageData.container);
              $navigator.setView(pageData.view);
            },
            addView: function (view) {
            },
            loadPage: function (view, url, content) {
            },
            goBack: function (view, url, preloadOnly) {
            }
          }
        };
      };

      app = new Framework7({
        ajaxLinks: false,
        init: false,
        onAjaxStart: function () {
          app.showIndicator();
        },
        onAjaxComplete: function () {
          app.hideIndicator();
        }
      });

      $timeout(app.init, 0);

      return app;
    })
;

