/**
 * check if the application was loaded from bookmark/direct url, or from a cognito login since
 * ?code will exist in the href if loaded from cognito.
 *
 * @param {*} the current url of the browser tab
 * @returns {boolean} true if the application was loaded due to a login via cognito
 */
const wasAppLoadedFromACognitoLogin = href => {
  return href.includes('log-in?code');
};

export { wasAppLoadedFromACognitoLogin };
