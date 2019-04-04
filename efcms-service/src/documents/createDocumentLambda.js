const createApplicationContext = require('../applicationContext');
const { handle, getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');

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
    return applicationContext.getUseCases().createDocument({
      applicationContext,
      caseId: event.pathParameters.caseId,
      document: JSON.parse(event.body),
    });
  });
