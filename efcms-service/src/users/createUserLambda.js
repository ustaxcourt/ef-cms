const { handle, getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const createApplicationContext = require('../applicationContext');

/**
 * creates a new document and attaches it to a case.  It also creates a work item on the docket section.
 *
 * @param {Object} event
 * @returns {Promise<*|undefined>}
 */
exports.post = event =>
  handle(() => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    return applicationContext.getUseCases().createUser({
      user: JSON.parse(event.body),
      applicationContext,
    });
  });