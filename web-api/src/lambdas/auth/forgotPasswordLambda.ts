import { APIGatewayProxyEvent } from 'aws-lambda';
import { forgotPasswordInteractor } from '@web-api/business/useCases/auth/forgotPasswordInteractor';
import { genericHandler } from '../../genericHandler';

export const forgotPasswordLambda = (event: APIGatewayProxyEvent) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await forgotPasswordInteractor(applicationContext, {
      ...JSON.parse(event.body!),
    });
  });
