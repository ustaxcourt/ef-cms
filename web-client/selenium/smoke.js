module.exports = {
  'Log In': function(browser) {
    browser
      .url('https://ui-dev.ustc-case-mgmt.flexion.us/log-in')
      .waitForElementVisible('body', 5000)
      .setValue('#name', 'taxpayer')
      .click('#log-in-button')
      .pause(5000)
      .assert.containsText('h1', 'Dashboard')
      .end();
  },
};
