const createApplicationContext = require('../applicationContext');

/**
 * used for retroactively sealing a case in a lower environment after it is sealed in the Production environment
 *
 * @param {object} event the AWS event object (including the information for what we need to seal)
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.sealInLowerEnvironmentLambda = async event => {
  const user = { role: 'docketclerk' };
  const applicationContext = createApplicationContext(user);

  applicationContext.logger.info('received a stream event of', event);

  const { docketEntryId, docketNumber } = JSON.parse(event.Message);

  if (docketEntryId && docketNumber) {
    // TODO: seal case in
  } else if (docketNumber) {
    return await applicationContext
      .getUseCases()
      .sealCaseInteractor(applicationContext, {
        docketNumber: event.docketNumber,
      });
  }
};
