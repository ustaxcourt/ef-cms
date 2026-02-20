import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCaseDocketEntriesInteractor } from '@web-api/business/useCases/getCaseDocketEntriesInteractor';

export const getCaseDocketEntriesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, () =>
    getCaseDocketEntriesInteractor(
      {
        docketNumber: event.pathParameters.docketNumber,
        eventCodes: event.queryStringParameters?.eventCodes
          ? event.queryStringParameters.eventCodes.split(',')
          : undefined,
        page: event.queryStringParameters?.page
          ? Number(event.queryStringParameters.page)
          : undefined,
        pageSize: event.queryStringParameters?.pageSize
          ? Number(event.queryStringParameters.pageSize)
          : undefined,
      },
      authorizedUser,
    ),
  );
