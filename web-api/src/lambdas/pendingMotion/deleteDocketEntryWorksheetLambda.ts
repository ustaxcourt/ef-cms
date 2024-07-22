import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deleteDocketEntryWorksheetInteractor } from '@web-api/business/useCases/pendingMotion/deleteDocketEntryWorksheetInteractor';
import { genericHandler } from '../../genericHandler';

export const deleteDocketEntryWorksheetLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, ({ applicationContext }) => {
    return deleteDocketEntryWorksheetInteractor(
      applicationContext,
      event.pathParameters.docketEntryId,
      authorizedUser,
    );
  });
