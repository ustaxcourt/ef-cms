const { getAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * creates a new document and attaches it to a case.  It also creates a work item on the docket section.
 *
 * @param {Object} event
 * @returns {Promise<*|undefined>}
 */
exports.createDocument = event =>
  handle(() => {
    const userId = getAuthHeader(event);
    const applicationContext = createApplicationContext({ userId });
    return applicationContext.getUseCases().createDocument({
      caseId: event.pathParameters.caseId,
      document: JSON.parse(event.body),
      applicationContext,
    });
  });
