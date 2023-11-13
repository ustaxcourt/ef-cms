import { Case } from '../entities/cases/Case';
import { NotFoundError } from '@web-api/errors/errors';

/**
 * getCaseExistsInteractor
 * Written to behave similarly to getCaseInteractor, except instead of returning
 * a complete case, will only return boolean 'true' if the case exists.
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get
 * @returns {boolean} whether case exists for requested docket number
 */
export const getCaseExistsInteractor = async (
  applicationContext: IApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: Case.formatDocketNumber(docketNumber),
    });

  const exists = Boolean(caseRecord.docketNumber && caseRecord.entityName);

  if (!exists) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  return exists;
};
