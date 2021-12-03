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

  const [record] = event.Records;
  const message = record.Sns.Message;

  applicationContext.logger.info('received a stream event of', {
    event: JSON.stringify(event),
    message,
  });

  const { docketEntryId, docketNumber } = JSON.parse(message);

  if (docketEntryId && docketNumber) {
    // TODO: once we can seal document: https://github.com/flexion/ef-cms/issues/4252
    // return await applicationContext
    //   .getUseCases()
    //   .sealDocumentInteractor(applicationContext, {
    //     docketEntryId,
    //     docketNumber,
    //   });
  } else if (docketNumber) {
    return await applicationContext
      .getUseCases()
      .sealCaseInteractor(applicationContext, {
        docketNumber,
      });
  }

  applicationContext.logger.warn(
    'Did not receive a valid docketEntryId or docketNumber to seal',
    {
      event,
    },
  );
};
