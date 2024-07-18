import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const createCsvCustomCaseReportFileLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .createCsvCustomCaseReportFileInteractor(
        applicationContext,
        JSON.parse(event.body),
        authorizedUser,
      );
  });
