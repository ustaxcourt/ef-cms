import { settlePromises } from '@web-api/utilities/settlePromises';
import { genericHandler } from '../../genericHandler';
import { handleBounceNotificationInteractor } from '@web-api/business/useCases/email/handleBounceNotificationInteractor';

/**
 * This lambda handles SNS notifications that occur whenever a service Email bounces. We
 * may need to take action when these events happen.
 *
 * @param {object} event the AWS event object received that includes any messages from our SNS subscription
 * @returns {Promise} the results from interactor processing the notifications
 */
export const handleBounceNotificationsLambda = event => {
  if (process.env.READ_ONLY_MODE === 'true') {
    throw new Error('Cannot execute handleBounceNotificationsLambda during read-only mode.');
  }

  return genericHandler(
    event,
    async ({ applicationContext }) => {
      const records = event.Records.map(record => ({
        ...JSON.parse(record.Sns.Message),
      }));

      return await settlePromises(
        records.map(record =>
          handleBounceNotificationInteractor(applicationContext, record),
        ),
      );
    },
    { bypassMaintenanceCheck: true },
  );
};
