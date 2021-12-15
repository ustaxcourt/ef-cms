/**
 * check if the user tried to login via the mock-login url (which happens during smoke tests).
 *
 * @param {*} the current url of the browser tab
 * @returns {boolean} true if the application was loaded due to a login via cognito
 */
const isOnMockLogin = href => {
  return href.includes('mock-login');
};

export { isOnMockLogin };
