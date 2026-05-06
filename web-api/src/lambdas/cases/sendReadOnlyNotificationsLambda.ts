import { genericHandler } from '../../genericHandler';
import { sendReadOnlyNotificationsInteractor } from '@web-api/business/useCases/maintenance/sendReadOnlyNotificationsInteractor';

export const sendReadOnlyNotificationsLambda = (event: { readOnlyMode: boolean }) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await sendReadOnlyNotificationsInteractor(applicationContext, {
        readOnlyMode: event.readOnlyMode,
      });
    },
    {
      bypassMaintenanceCheck: true,
    },
  );
