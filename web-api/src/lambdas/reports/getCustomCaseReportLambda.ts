import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCustomCaseReportInteractor } from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';

export const getCustomCaseReportLambda = (event, user: UnknownAuthUser) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getCustomCaseReportInteractor(
        applicationContext,
        event.queryStringParameters,
        user,
      );
    },
    user,
  );
