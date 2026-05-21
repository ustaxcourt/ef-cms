import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '@web-api/applicationContext';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { sealInLowerEnvironment } from '@web-api/business/useCaseHelper/sealInLowerEnvironment';
import { rescheduleLambda } from '@web-api/dispatchers/sqs/rescheduleLambda';

/**
 * used for retroactively sealing a case in a lower environment after it is sealed in the Production environment
 *
 * @param {object} event the AWS event object received that includes any messages from our SNS subscription
 * @returns {Promise<*>|undefined} the response to the topic
 */
export const sealInLowerEnvironmentLambda = async event => {
  if (process.env.READ_ONLY_MODE === 'true') {
    getDawsonLogger().info(
      'Skipping sealInLowerEnvironmentLambda due to read-only mode. Retrying in 180 seconds.',
    );
    await rescheduleLambda(applicationContext, { event }, 180);
    return;
  }

  const user: AuthUser = {
    email: 'system@ustc.gov',
    name: 'ustc automated system',
    role: 'docketclerk',
    userId: 'N/A',
  };

  getDawsonLogger().addUser({ user });

  const records = event.Records.map(record => ({
    ...JSON.parse(record.Sns.Message),
  }));

  return await sealInLowerEnvironment(applicationContext, records, user);
};
