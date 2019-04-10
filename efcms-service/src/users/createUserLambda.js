const {
  handle,
  getUserFromAuthHeader,
} = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * creates a new document and attaches it to a case.  It also creates a work item on the docket section.
 *
 * @param {Object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    return applicationContext.getUseCases().createUser({
      applicationContext,
      user: JSON.parse(event.body),
    });
  });
