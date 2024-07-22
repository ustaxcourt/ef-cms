import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { exportPendingReportInteractor } from '@web-api/business/useCases/pendingItems/exportPendingReportInteractor';
import { genericHandler } from '../../genericHandler';

export const exportPendingReportLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await exportPendingReportInteractor(
        applicationContext,
        {
          ...event.queryStringParameters,
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
