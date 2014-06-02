Framework7.prototype.plugins.demoPlugin = function (app, params) {
  /*
   @app - initialized App instance
   @params - your local plugin params. Should be passed as an parameter on app initialization with same name as your plugin name (like demoPlugin in this plugin):
   var app = new Framework7({
   modalTitle: 'my app',
   //Here comes your plugin params
   demoPlugin: {
   param1: 50,
   param2: true
   },
   //Or like boolean flag:
   demoPlugin: true
   });
   */

  /*
   Here comes your local plugin scope.
   Your plugin should return object that may contain 3 objects with methods:
   - 'hooks': they work just like ususal callbacks, they called by apps on dirrent stages. Each hook receives different arguments
   - 'prevents' (not injected to app yet): they allow to prevent some app actions, for example they will allow you to prevent pages animation and make your own
   - 'process' (not injected to app yet): they work like preprocessors, each process method may takes data and return it modified
   */

  /* Note, that your plugin initialized on the first stage of app initialization and few things may be still unneaccessable here. If you need to execute code when app is fully initialized, use 'appInit' hook */

  /* This demo plugin does nothing, just console.log every available hook with arguments. May count that this is a Debug plugin */

  function appInit() {
    // Do something when app fully initialized
    console.log('appInit');
  }

  // Return object
  return {
    // Object contains hooks, all hooks are optional, don't use those you don't need
    hooks: {
      appInit: appInit,
      navbarInit: function (navbar, pageData) {
        console.log('navbarInit', navbar, pageData);
      },
      pageInit: function (pageData) {
        console.log('pageInit', pageData);
      },
      pageBeforeInit: function (pageData) {
        console.log('pageBeforeInit', pageData);
      },
      pageBeforeAnimation: function (pageData) {
        console.log('pageBeforeAnimation', pageData);
      },
      pageAfterAnimation: function (pageData) {
        console.log('pageAfterAnimation', pageData);
      },
      addView: function (view) {
        console.log('addView', view);
      },
      load: function (view, url, content) {
        console.log('load', view, url, content);
      },
      goBack: function (view, url, preloadOnly) {
        console.log('goBack', view, url, preloadOnly);
      }
    }
  };
};


angular.module('framework7', [])

    .directive('view', function ($app, $compile, $navigator) {
      return {
        restrict: 'C',
        controller: function ($scope, $element, $attrs, $transclude) {
        },
        link: function (scope, element, attrs, ctrl) {
          var view;

          view = $app.addView(element, {
            dynamicNavbar: attrs.dynamicNavbar,
            domCache: attrs.domCache,
            linksView: attrs.linksView,
            subEvents: attrs.subEvents
          });

          console.log('View initialized: ' + attrs.id);

          if (attrs.startPage){
            $navigator.setCurrentView(view);
            $navigator.setCurrentPage(attrs.startPage, scope);
          }

          element.on('pageInit', function (event) {
            console.log('pageInit init in view');
            var page = event.detail.page,
                childScope,
                container;

            $navigator.setCurrentView(page.view);

            $navigator.getCurrentScope()
                .then(function (navigatorScope) {
                  container = angular.element(page.container);
                  childScope = navigatorScope || scope;

                  $compile(container)(childScope);
                })
          });
        }
      };
    })

    .directive('navbar', function ($compile, $navigator) {
      return {
        restrict: 'C',
        link: function (scope, element, attrs) {
          element.on('navbarInit', function (event) {
            console.log('navbarInit in navbar');

            var container,
                childScope,
                navbar = event.detail.navbar;

            $navigator.getCurrentScope()
                .then(function (navigatorScope) {
                  container = angular.element(navbar.innerContainer);
                  childScope = navigatorScope || scope;

                  $compile(container)(childScope);
                })
          })
        }
      };
    })

    .directive('navigateToPage', function ($navigator) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.on('click', function (event) {
            $navigator.setCurrentPage(attrs.navigateToPage, element.scope());
          });
        }
      };
    })

    .provider('$navigator', function () {
      var _config = {},
          _currentScope,
          _currentView,
          _currentPage;

      this.page = function (name, state) {
        _config[name] = state;
      };

      this.$get = function ($controller, $injector, $q, $app) {
        return {
          setCurrentPage: function (page, scope) {
            var resolve,
                result,
                promises = {},
                deferred;

            deferred = $q.defer();
            _currentScope = deferred.promise;

            var instantiate = function () {
              if (_currentPage.controller) {
                $controller(_currentPage.controller, {$scope: scope});
              }

              if (!_currentPage || !_currentPage.templateUrl){
                throw new Error('No page config or template for : ' + pageName);
              }

              _currentView.loadPage(_currentPage.templateUrl);

              deferred.resolve(scope);
            };

            _currentPage = _config[page];
            resolve = _currentPage.resolve;

            if (!page) {
              throw new Error('Page not found in $navigatorProvider config: ' + page);
            }

            if (!resolve) {
              instantiate();
              return;
            }

            // Resolve

            for (var item in resolve) {
              result = $injector.invoke(resolve[item]);
              if (result.then) {
                promises[item] = result;
              } else {
                scope[item] = result;
              }
            }

            $q.all(promises).then(function (result) {
              angular.extend(scope, result);
              instantiate();
            })
          },

          getCurrentScope: function () {
            return _currentScope;
          },

          setCurrentView: function (view) {
            _currentView = view;
          },

          getCurrentView: function () {
            return _currentView;
          },

          goBack: function () {
            _currentView.goBack()
          }
        };
      }
    })

    .factory('$app', function () {
      var app;

      app = new Framework7({
        ajaxLinks: false,
        init: false,
        preprocess: function (content, url) {
          console.log('Loaded : ' + url);

          return content;
        },
        onAjaxStart: function () {
          app.showIndicator();
        },
        onAjaxComplete: function () {
          app.hideIndicator();
        }
      });

      app.init();

      return app;
    });

