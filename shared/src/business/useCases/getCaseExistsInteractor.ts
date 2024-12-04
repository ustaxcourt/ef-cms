import { NotFoundError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

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
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  const caseRecord = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  if (!caseRecord) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  return !!caseRecord;
};
