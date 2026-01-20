import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
import { NotFoundError } from '@web-api/errors/errors';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { PublicCaseDTO } from '@shared/business/dto/docketEntries/PublicCaseDTO';
import { RestrictedCaseDTO } from '@shared/business/dto/docketEntries/RestrictedCaseDTO';

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

  return CaseFactory.getCaseDTO({ rawCase: rawCaseRecord, user: undefined }) as
    | PublicCaseDTO
    | RestrictedCaseDTO;
};
