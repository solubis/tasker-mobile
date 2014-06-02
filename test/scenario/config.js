// An example configuration file.
exports.config = {
    // Do not start a Selenium Standalone sever - only run this using chrome.
    chromeOnly: true,
    chromeDriver: '/usr/local/bin/chromedriver',

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    // Spec patterns are relative to the current working directly when
    // protractor is called.
    specs: ['tasks-spec.js'],

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};