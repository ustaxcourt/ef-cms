module.exports = {
  'Log In': function(browser) {
    browser
      .url('https://ui-dev.ustc-case-mgmt.flexion.us/log-in')
      .waitForElementVisible('body', 1000)
      .setValue('#name', 'taxpayer')
      .click('input[type=submit]')
      .pause(1000)
      .assert.containsText('h1', 'Dashboard')
      .end();
  },
};
