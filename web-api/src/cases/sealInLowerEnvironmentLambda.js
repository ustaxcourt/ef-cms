const createApplicationContext = require('../applicationContext');

/**
 * used for retroactively sealing a case in a lower environment after it is sealed in the Production environment
 *
 * @param {object} event the AWS event object (including the information for what we need to seal)
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.sealInLowerEnvironmentLambda = async event => {
  const applicationContext = createApplicationContext({});
  applicationContext.logger.debug('received a stream event of', event);
  // TODO: When we can seal a document, maybe that's included in the event, and we can call that lambda to seal it in the lower environment
  return await applicationContext
    .getUseCases()
    .sealCaseInteractor(applicationContext, {
      docketNumber: event.docketNumber,
    });
};
