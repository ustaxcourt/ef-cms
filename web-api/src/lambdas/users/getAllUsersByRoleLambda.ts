import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getAllUsersByRoleInteractor } from '@shared/business/useCases/getAllUsersByRoleInteractor';

export const getAllUsersByRoleLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getAllUsersByRoleInteractor(
        applicationContext,
        event.queryStringParameters,
        authorizedUser,
      );
    },
    authorizedUser,
    {
      bypassMaintenanceCheck: true,
    },
  );
