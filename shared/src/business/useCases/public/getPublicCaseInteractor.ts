import { Case } from '../../entities/cases/Case';
import { formatPublicCase } from '../../useCaseHelper/consolidatedCases/formatPublicCase';

/**
 * getPublicCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get
 * @returns {object} the case data
 */
export const getPublicCaseInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  let rawCaseRecord: any = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: Case.formatDocketNumber(docketNumber),
    });

  return formatPublicCase({ applicationContext, docketNumber, rawCaseRecord });
};
