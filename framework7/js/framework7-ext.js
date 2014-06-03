angular.module('framework7', [])

    .directive('view', function ($app, $compile, $navigator) {
      return {
        restrict: 'C',
        link: function (scope, element, attrs, ctrl) {
          $app.addView(element, {
            dynamicNavbar: attrs.dynamicNavbar,
            domCache: attrs.domCache,
            linksView: attrs.linksView,
            subEvents: attrs.subEvents
          });
        }
      };
    })

    .directive('itemLink', function ($navigator) {
      return {
        restrict: 'C',
        link: function (scope, element, attrs) {
          element.on('click', function (event) {
            $navigator.setScope(element.scope());
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

      this.$get = function ($controller, $injector) {
        var nav;

        nav = {
          getPageConfig: function (name) {
            return _config[name];
          },
          setScope: function (scope) {
            _scope = scope;
          },
          getScope: function () {
            return _scope;
          },
          setView: function(view){
            _view = view;
          },
          goBack: function(){
            _view.goBack();
          }
        };

        return nav;
      }
    })

    .factory('$app', function ($navigator, $compile, $controller, $timeout, $injector) {
      var app;

      function compile(pageName, container){
        var resolve,
            result,
            config,
            scope,
            container,
            controller;

        container = angular.element(container);
        scope = container.scope();
        scope = $navigator.getScope() || scope;

        config = $navigator.getPageConfig(pageName);

        if (!config) {
          $compile(container)(scope);
          return;
        }

        resolve = config.resolve;
        controller = config.controller;

        for (var item in resolve) {
          result = $injector.invoke(resolve[item]);
          scope[item] = result;
        }

        if (controller) {
          $controller(controller, {$scope: scope});
        }

        $compile(container)(scope);

        scope.$digest();
      }

      Framework7.prototype.plugins.demoPlugin = function (app, params) {
        return {
          hooks: {
            navbarInit: function (navbar, pageData) {
              console.log('#navbarInit ', pageData.name, pageData.view ? pageData.view.container.id : 'NOVIEW');
              compile(pageData.name, navbar.container);
            },
            pageInit: function (pageData) {
              console.log('#pageInit', pageData.name, pageData.view ? pageData.view.container.id : 'NOVIEW');
              compile(pageData.name, pageData.container);
              $navigator.setView(pageData.view);
            }
          },
          addView: function (view) {
            console.log('#addView', view);
          },
          loadPage: function (view, url, content) {
            console.log('#load', view, url, content);
          },
          goBack: function (view, url, preloadOnly) {
            console.log('#goBack', view, url, preloadOnly);
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
    });

