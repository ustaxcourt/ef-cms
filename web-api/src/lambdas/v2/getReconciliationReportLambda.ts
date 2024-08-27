import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getReconciliationReportInteractor } from '@shared/business/useCases/getReconciliationReportInteractor';
import { v2ApiWrapper } from './v2ApiWrapper';

/**
 * used for getting the reconciliation report for IRS Superuser that lists all
 * items served on the IRS (indicated by servedParty of R or B) on a specific
 * day (12:00am-11:59:59pm ET)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the reconciliation report
 */
export const getReconciliationReportLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, ({ applicationContext }) => {
    return v2ApiWrapper(async () => {
      const { end, start } = event.queryStringParameters;
      //url will contain the reconciliation date in path parameters, and times in the query string
      const parms = { ...event.pathParameters, end, start };
      const report = await getReconciliationReportInteractor(
        applicationContext,
        parms,
        authorizedUser,
      );

      return report;
    });
  });
