// Karma configuration
// Generated on Sun Sep 22 2013 13:39:53 GMT+0200 (CEST)

module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    frameworks: ["jasmine"],
    // list of files / patterns to load in the browser
    files: [
      'lib/angular/angular.js',
      'lib/angular-mocks/angular-mocks.js',
      'lib/pouchdb/dist/pouchdb-nightly.js',
      'lib/chance/chance.js',
      'lib/ionic/release/js/ionic.js',
      'lib/ionic/release/js/ionic-angular.js',
      'ionic/js/**/*.js',
      'common/js/**/*.js',

      'test/unit/**/*-spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['ChromeCanary'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};


