import { genericHandler } from '../../genericHandler';

export const getAllUsersByRoleLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getAllUsersByRoleInteractor(
          applicationContext,
          event.queryStringParameters,
        );
    },
    {
      bypassMaintenanceCheck: true,
    },
  );
