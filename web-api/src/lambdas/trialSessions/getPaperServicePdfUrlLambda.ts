import { APIGatewayProxyEvent } from 'aws-lambda';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getPaperServicePdfUrlInteractor } from '@shared/business/useCases/getPaperServicePdfUrlInteractor';

export const getPaperServicePdfUrlLambda = (
  event: APIGatewayProxyEvent,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getPaperServicePdfUrlInteractor(
        applicationContext,
        event.pathParameters,
        authorizedUser,
      );
    },
    authorizedUser,
    { logResults: false },
  );
