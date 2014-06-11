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
        scope: false,
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
            if (scope.refresh instanceof Function) {
              scope.refresh()
                  .then(function () {
                    $app.pullToRefreshDone(element);
                  });
            }
          });
        }
      };
    })

    .directive('buttonsRow', function () {
      return {
        restrict: 'C',
        scope: {
          onChange: "&"
        },
        controller: function ($scope, $element) {
          var buttons = [];

          buttons = $element.children();

          function activate(button) {
            angular.forEach(buttons, function (item, index) {
              var element = angular.element(item);
              if (item === button) {
                $scope.$apply(function () {
                  $scope.onChange({index: index});
                });

                element.addClass('active');
              } else {
                element.removeClass('active');
              }
            });
          }

          angular.forEach(buttons, function (element) {
            angular.element(element).on('click', function () {
              activate(this);
            });
          })
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
            var scope = _scope;
            _scope = undefined;
            return scope;
          },
          setView: function (view) {
            _view = view;
          },
          goBack: function () {
            _view.goBack();
          },
          loadPage: function (url) {
            _view.loadPage(url);
          }
        };

        return nav;
      }
    })

    .factory('$app', function ($navigator, $compile, $controller, $timeout, $injector) {
      var app, _navbar, _scopes = {};

      function setNavbar(name, container) {
        _navbar = {
          name: name,
          container: container
        }
      }

      function compile(pageName, container) {
        var config,
            scope,
            controller;

        config = $navigator.getPageConfig(pageName);

        if (!config) {
          return;
        }

        container = angular.element(container);

        scope = $navigator.getScope() || container.scope().$new();

        controller = config.controller;

        if (controller) {
          $controller(controller, {$scope: scope});
        }

        $compile(container)(scope);

        if (_navbar && _navbar.name === pageName) {
          $compile(_navbar.container)(scope);
        }

        scope.$digest();

        _scopes[pageName] = scope;
      }

      Framework7.prototype.plugins.demoPlugin = function (app, params) {
        return {
          hooks: {
            navbarInit: function (navbar, pageData) {
              setNavbar(pageData.name, navbar.container);
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
            },
            pageBeforeRemove: function (pageData) {
              if (_scopes[pageData.name]) {
                _scopes[pageData.name].$destroy();
                delete _scopes[pageData.name];
              }
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

