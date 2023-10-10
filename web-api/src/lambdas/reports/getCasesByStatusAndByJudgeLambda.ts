import { APIGatewayProxyEvent } from 'aws-lambda';
import { genericHandler } from '../../genericHandler';

export const getCasesByStatusAndByJudgeLambda = (event: APIGatewayProxyEvent) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getCasesByStatusAndByJudgeInteractor(
          applicationContext,
          event.queryStringParameters,
        );
    },
    { logResults: false },
  );
