const getOnly = urls => {
  const only = urls.filter(url => url.only);
  if (only.length) {
    urls = only.map(o => ({
      ...o,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log,
      },
    }));
  }
  return urls;
};

const setTimeouts = url => {
  return {
    ...url,
    timeout: 60000,
  };
};

const loginAs = ({ username }) => {
  return [
    'wait for [data-testid="email-input"] to be visible',
    `set field [data-testid="email-input"] to ${username}`,
    'set field [data-testid="password-input"] to Testing1234$',
    'click element [data-testid="login-button"]',
    'wait for [data-testid="account-menu-button"] to be visible',
  ];
};

module.exports = {
  getOnly,
  loginAs,
  setTimeouts,
};
