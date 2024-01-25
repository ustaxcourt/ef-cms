import { APIGatewayProxyEvent } from 'aws-lambda';
import { genericHandler } from '../../genericHandler';

export const forgotPasswordLambda = (event: APIGatewayProxyEvent) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .forgotPasswordInteractor(applicationContext, {
          ...JSON.parse(event.body!),
        });
    },
    {
      bypassMaintenanceCheck: true,
    },
  );
