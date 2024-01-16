import { APIGatewayProxyEvent } from 'aws-lambda';
import { genericHandler } from '../../genericHandler';

export const changePasswordLambda = (event: APIGatewayProxyEvent) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .changePasswordInteractor(applicationContext, {
          ...JSON.parse(event.body),
        });
    },
    { logResults: false },
  );
