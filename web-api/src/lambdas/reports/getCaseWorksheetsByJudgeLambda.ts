import { APIGatewayProxyEvent } from 'aws-lambda';
import { genericHandler } from '../../genericHandler';

export const getCaseWorksheetsByJudgeLambda = (event: APIGatewayProxyEvent) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getCaseWorksheetsByJudgeInteractor(
          applicationContext,
          event.queryStringParameters,
        );
    },
    { logResults: false },
  );
