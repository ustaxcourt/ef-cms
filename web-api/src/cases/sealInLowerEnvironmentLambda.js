const createApplicationContext = require('../applicationContext');

/**
 * used for retroactively sealing a case in a lower environment after it is sealed in the Production environment
 *
 * @param {object} event the AWS event object received that includes any messages from our SNS subscription
 * @returns {Promise<*>|undefined} the response to the topic
 */
exports.sealInLowerEnvironmentLambda = async event => {
  const user = { role: 'docketclerk' };
  const applicationContext = createApplicationContext(user);

  if (!applicationContext.isCurrentColorActive(applicationContext)) {
    applicationContext.logger.warn('This is not the currently deployed color');
    return;
  }

  return await Promise.all(
    event.Records.map(record =>
      applicationContext
        .getUseCases()
        .sealInLowerEnvironmentInteractor(applicationContext, {
          ...JSON.parse(record.Sns.Message),
        }),
    ),
  );
};
