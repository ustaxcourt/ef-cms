import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getAllUsersByRoleInteractor } from '@web-api/business/useCases/getAllUsersByRoleInteractor';

export const getAllUsersByRoleLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async () => {
      return await getAllUsersByRoleInteractor(
        event.queryStringParameters,
        authorizedUser,
      );
    },
    {
      bypassMaintenanceCheck: true,
    },
  );
