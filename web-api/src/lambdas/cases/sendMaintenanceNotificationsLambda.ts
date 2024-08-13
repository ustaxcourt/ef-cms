import { genericHandler } from '../../genericHandler';
import { sendMaintenanceNotificationsInteractor } from '@web-api/business/useCases/maintenance/sendMaintenanceNotificationsInteractor';

/**
 * lambda which is used to send notifications to all users when maintenance mode is toggled
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const sendMaintenanceNotificationsLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await sendMaintenanceNotificationsInteractor(applicationContext, {
        maintenanceMode: event.maintenanceMode,
      });
    },
    {
      bypassMaintenanceCheck: true,
    },
  );
