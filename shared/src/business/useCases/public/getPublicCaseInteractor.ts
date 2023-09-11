import { Case } from '../../entities/cases/Case';
import { NotFoundError } from '@web-api/errors/errors';
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

  if (!rawCaseRecord.docketNumber && !rawCaseRecord.entityName) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  return formatPublicCase({ applicationContext, rawCaseRecord });
};
