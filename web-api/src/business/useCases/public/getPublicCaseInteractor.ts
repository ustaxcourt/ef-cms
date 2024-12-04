import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
import { NotFoundError } from '@web-api/errors/errors';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import { RestrictedCase } from '@shared/business/entities/cases/RestrictedCase';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

/**
 * getPublicCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get
 * @returns {object} the case data
 */
export const getPublicCaseInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  let rawCaseRecord: any = await getCaseByDocketNumber({
    applicationContext,
    docketNumber: Case.formatDocketNumber(docketNumber),
  });

  if (!rawCaseRecord.docketNumber && !rawCaseRecord.entityName) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  return CaseFactory.getCase({ rawCase: rawCaseRecord, user: undefined }) as
    | PublicCase
    | RestrictedCase;
};
