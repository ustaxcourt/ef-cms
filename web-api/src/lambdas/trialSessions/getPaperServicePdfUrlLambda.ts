import { APIGatewayProxyEvent } from 'aws-lambda';
import { genericHandler } from '../../genericHandler';

export const getPaperServicePdfUrlLambda = (event: APIGatewayProxyEvent) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getPaperServicePdfUrlInteractor(
          applicationContext,
          event.pathParameters,
        );
    },
    { logResults: false },
  );
