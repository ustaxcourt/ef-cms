import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createCsvCustomCaseReportFileInteractor } from '@web-api/business/useCases/customCaseReport/createCsvCustomCaseReportFileInteractor';
import { genericHandler } from '../../genericHandler';

export const createCsvCustomCaseReportFileLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    return await createCsvCustomCaseReportFileInteractor(
      JSON.parse(event.body),
      authorizedUser,
    );
  });
