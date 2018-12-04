const nightwatchConfig = {
  src_folders: ['selenium'],

  selenium: {
    start_process: false,
    host: 'hub-cloud.browserstack.com',
    port: 80,
  },

  common_capabilities: {
    'browserstack.user': process.env.BROWSERSTACK_USER,
    'browserstack.key': process.env.BROWSERSTACK_KEY,
  },

  test_settings: {
    default: {},
    chrome: {
      desiredCapabilities: {
        browser: 'chrome',
      },
    },
    firefox: {
      desiredCapabilities: {
        browser: 'firefox',
      },
    },
    safari: {
      desiredCapabilities: {
        browser: 'safari',
      },
    },
    edge: {
      desiredCapabilities: {
        browser: 'edge',
      },
    },
    ie: {
      desiredCapabilities: {
        browser: 'internet explorer',
      },
    },
  },
};

// Code to support common capabilites
for (var i in nightwatchConfig.test_settings) {
  var config = nightwatchConfig.test_settings[i];
  config['selenium_host'] = nightwatchConfig.selenium.host;
  config['selenium_port'] = nightwatchConfig.selenium.port;
  config['desiredCapabilities'] = config['desiredCapabilities'] || {};
  for (var j in nightwatchConfig.common_capabilities) {
    config['desiredCapabilities'][j] =
      config['desiredCapabilities'][j] ||
      nightwatchConfig.common_capabilities[j];
  }
}

console.log(process.env.BROWSERSTACK_USER, process.env.BROWSERSTACK_KEY);

module.exports = nightwatchConfig;
