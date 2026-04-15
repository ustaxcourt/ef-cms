import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createApplicationContext } from '../../applicationContext';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { sealInLowerEnvironment } from '@web-api/business/useCaseHelper/sealInLowerEnvironment';

/**
 * used for retroactively sealing a case in a lower environment after it is sealed in the Production environment
 *
 * @param {object} event the AWS event object received that includes any messages from our SNS subscription
 * @returns {Promise<*>|undefined} the response to the topic
 */
export const sealInLowerEnvironmentLambda = async event => {
  // If this lambda is invoked while in read-only mode, we must return without doing anything.
  // Otherwise, it will attempt to update the case and will fail
  if (process.env.READ_ONLY_MODE === 'true') {
    getDawsonLogger().info('Skipping sealInLowerEnvironmentLambda due to read-only mode.');
    return;
  }

  const user: AuthUser = {
    email: 'system@ustc.gov',
    name: 'ustc automated system',
    role: 'docketclerk',
    userId: 'N/A',
  };

  const applicationContext = createApplicationContext();
  getDawsonLogger().addUser({ user });

  const records = event.Records.map(record => ({
    ...JSON.parse(record.Sns.Message),
  }));

  return await sealInLowerEnvironment(applicationContext, records, user);
};
