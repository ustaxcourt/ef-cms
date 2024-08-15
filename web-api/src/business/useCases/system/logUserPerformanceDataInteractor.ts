import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';

export const logUserPerformanceDataInteractor = async (
  applicationContext: ServerApplicationContext,
  performanceData: {
    sequenceName: string;
    duration: number;
    actionPerformanceArray: { actionName: string; duration: number }[];
  },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError('Unauthorized to log performance data');
  }

  const { email } = authorizedUser;
  await applicationContext.getPersistenceGateway().saveSystemPerformanceData({
    applicationContext,
    performanceData: {
      ...performanceData,
      email,
    },
  });
};
