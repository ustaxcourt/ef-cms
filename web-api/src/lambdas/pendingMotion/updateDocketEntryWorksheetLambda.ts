import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateDocketEntryWorksheetInteractor } from '@web-api/business/useCases/pendingMotion/updateDocketEntryWorksheetInteractor';

export const updateDocketEntryWorksheetLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await updateDocketEntryWorksheetInteractor(
      applicationContext,
      JSON.parse(event.body),
      authorizedUser,
    );
  });
