import { settlePromises } from '@web-api/utilities/settlePromises';
import { genericHandler } from '../../genericHandler';
import { handleBounceNotificationInteractor } from '@web-api/business/useCases/email/handleBounceNotificationInteractor';
import { rescheduleLambda } from '@web-api/dispatchers/sqs/rescheduleLambda';

/**
 * This lambda handles SNS notifications that occur whenever a service Email bounces. We
 * may need to take action when these events happen.
 *
 * @param {object} event the AWS event object received that includes any messages from our SNS subscription
 * @returns {Promise} the results from interactor processing the notifications
 */
export const handleBounceNotificationsLambda = event => {
  return genericHandler(
    event,
    async ({ applicationContext }) => {
      if (process.env.READ_ONLY_MODE === 'true') {
        applicationContext.logger.info(
          'Skipping handleBounceNotificationsLambda due to read-only mode. Retrying in 180 seconds.',
        );
        await rescheduleLambda(applicationContext, { event }, 180);
        return;
      }

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
