const createApplicationContext = require('../applicationContext');

/**
 * This lambda handles SNS notifications that occur whenever a service Email bounces. We
 * may need to take action when these events happen.
 *
 * @param {object} event the AWS event object received that includes any messages from our SNS subscription
 * @returns {Promise<*>|undefined} the response to the topic
 */
exports.handleBounceNotificationsLambda = async event => {
  const applicationContext = createApplicationContext({});

  const records = event.Records.map(record => ({
    ...JSON.parse(record.Sns.Message),
  }));

  return await Promise.all(
    records.map(record =>
      applicationContext
        .getUseCases()
        .handleBounceNotificationInteractor(applicationContext, record),
    ),
  );
};
