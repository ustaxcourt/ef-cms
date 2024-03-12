import { APIGatewayProxyEvent } from 'aws-lambda';
import { genericHandler } from '../../genericHandler';

export const confirmSignUpLambda = (event: APIGatewayProxyEvent) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .confirmSignUpInteractor(applicationContext, {
          ...JSON.parse(event.body),
        });
    },
    { logResults: true },
  );
