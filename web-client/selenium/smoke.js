module.exports = {
  'Log In': function(browser) {
    browser
      .url(
        'https://auth-dev-flexion-efcms.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=6tu6j1stv5ugcut7dqsqdurn8q&redirect_uri=https%3A//ui-dev.ustc-case-mgmt.flexion.us/log-in',
      )
      .waitForElementVisible('.visible-lg input[name="username"]', 15000)
      .setValue('.visible-lg input[name="username"]', 'petitioner1@example.com')
      .setValue('.visible-lg input[name="password"]', 'Testing1234$')
      .click('.visible-lg input[name="signInSubmitButton"]')
      .waitForElementVisible('.new-case', 15000)
      .assert.containsText('h1', 'Welcome, Test petitioner1')
      .click('.new-case')
      .waitForElementVisible('.before-starting-case', 15000)
      .assert.containsText('h1', 'Before you begin')
      .end();
  },
};
