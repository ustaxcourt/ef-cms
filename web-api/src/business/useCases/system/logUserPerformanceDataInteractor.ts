import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const logUserPerformanceDataInteractor = async (
  applicationContext: ServerApplicationContext,
  performanceData: {
    sequenceName: string;
    duration: number;
    actionPerformanceArray: { actionName: string; duration: number }[];
    email: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!authorizedUser || !authorizedUser.userId) {
    throw new UnauthorizedError('Unauthorized to log performance data');
  }

  await applicationContext
    .getPersistenceGateway()
    .saveSystemPerformanceData({ applicationContext, performanceData });
};
