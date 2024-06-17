import { UnknownAuthUser } from '@web-api/middleware/apiGatewayHelper';
import { genericHandler } from '../../genericHandler';

export const getCustomCaseReportLambda = (event, user: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCustomCaseReportInteractor(
        applicationContext,
        event.queryStringParameters,
        user,
      );
  });
