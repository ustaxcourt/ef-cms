import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { coldCaseReportInteractor } from '@web-api/business/useCases/reports/coldCaseReportInteractor';
import { genericHandler } from '../../genericHandler';

export const coldCaseReportLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await coldCaseReportInteractor(applicationContext, authorizedUser);
    },
    authorizedUser,
  );
