/**
 * check if the user tried to login via the log-in?token url (which happens during smoke tests).
 *
 * @param {*} the current url of the browser tab
 * @returns {boolean} true if the application was loaded due to a login via cognito
 */
const wasLoginUsingTokenInUrl = href => {
  return href.includes('log-in?token');
};

export { wasLoginUsingTokenInUrl };
