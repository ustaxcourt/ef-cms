import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getSingleDocketEntryInteractor } from '@web-api/business/useCases/docketEntry/getSingleDocketEntryInteractor';

export const getSingleDocketEntryLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, () =>
    getSingleDocketEntryInteractor(
      {
        docketEntryId: event.pathParameters.docketEntryId,
        docketNumber: event.pathParameters.docketNumber,
      },
      authorizedUser,
    ),
  );
