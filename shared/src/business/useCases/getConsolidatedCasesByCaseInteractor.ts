import { Case } from '../entities/cases/Case';

/**
 * getConsolidatedCasesByCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber docket number of the case to get associated cases for
 * @returns {Array<object>} the cases the user is associated with
 */
export const getConsolidatedCasesByCaseInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  const consolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: docketNumber,
    });

  return Case.validateRawCollection(consolidatedCases, { applicationContext });
};
