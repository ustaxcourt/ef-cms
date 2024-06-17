import { CaseDeadline } from '../../../../../shared/src/business/entities/CaseDeadline';
import { ServerApplicationContext } from '@web-api/applicationContext';

/**
 * getCaseDeadlinesForCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get case deadlines for
 * @returns {Promise} the promise of the getCaseDeadlines call
 */
export const getCaseDeadlinesForCaseInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  const caseDeadlines = await applicationContext
    .getPersistenceGateway()
    .getCaseDeadlinesByDocketNumber({
      applicationContext,
      docketNumber,
    });

  return CaseDeadline.validateRawCollection(caseDeadlines, {
    applicationContext,
  });
};
