const { updateCase } = require('ef-cms-shared/src/business/useCases/updateCase.interactor');
const { handle, getAuthHeader } = require('../middleware/apiGatewayHelper');
const applicationContext = require('../applicationContext');

/**
 * updateCase
 *
 * @param event
 * @returns {Promise<*|undefined>}
 */
exports.put = event =>
  handle(() => {
    console.log('event.body', event.body);
    const userId = getAuthHeader(event);
    return updateCase({
      caseId: event.pathParameters.caseId,
      caseToUpdate: JSON.parse(event.body),
      userId,
      applicationContext,
    });
  });
