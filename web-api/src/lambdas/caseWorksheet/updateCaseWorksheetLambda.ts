import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateCaseWorksheetInteractor } from '@web-api/business/useCases/caseWorksheet/updateCaseWorksheetInteractor';

export const updateCaseWorksheetLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await updateCaseWorksheetInteractor(
      applicationContext,
      JSON.parse(event.body),
      authorizedUser,
    );
  });
