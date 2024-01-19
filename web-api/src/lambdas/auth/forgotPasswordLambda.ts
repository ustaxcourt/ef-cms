import { APIGatewayProxyEvent } from 'aws-lambda';
import { genericHandler } from '../../genericHandler';

export const forgotPasswordLambda = (event: APIGatewayProxyEvent) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      await applicationContext
        .getUseCases()
        .forgotPasswordInteractor(applicationContext, {
          ...JSON.parse(event.body!),
        });

      return {
        body: { bad: 'this is bad' },
        statusCode: 200,
      };
    },
    {
      bypassMaintenanceCheck: true,
    },
  );
