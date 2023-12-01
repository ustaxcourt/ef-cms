import { serverApplicationContext } from '../../applicationContext';

/**
 * used for retroactively sealing a case in a lower environment after it is sealed in the Production environment
 *
 * @param {object} event the AWS event object received that includes any messages from our SNS subscription
 * @returns {Promise<*>|undefined} the response to the topic
 */
export const sealInLowerEnvironmentLambda = async event => {
  const user = { role: 'docketclerk' };
  serverApplicationContext.setCurrentUser(user);
  const applicationContext = serverApplicationContext;

  const records = event.Records.map(record => ({
    ...JSON.parse(record.Sns.Message),
  }));

  return await applicationContext
    .getUseCaseHelpers()
    .sealInLowerEnvironment(applicationContext, records);
};
