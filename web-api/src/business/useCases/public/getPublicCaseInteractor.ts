import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
import { NotFoundError } from '@web-api/errors/errors';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import { RestrictedCase } from '@shared/business/entities/cases/RestrictedCase';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

export const getPublicCaseInteractor = async ({
  docketNumber,
}: {
  docketNumber: string;
}) => {
  const rawCaseRecord = await getCaseByDocketNumber({
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
