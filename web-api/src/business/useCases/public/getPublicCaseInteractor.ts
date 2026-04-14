import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
import { NotFoundError } from '@web-api/errors/errors';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { PublicCaseDTO } from '@shared/business/dto/cases/PublicCaseDTO';
import { RestrictedCaseDTO } from '@shared/business/dto/cases/RestrictedCaseDTO';

export const getPublicCaseInteractor = async ({
  docketNumber,
  excludeDocketEntries,
}: {
  docketNumber: string;
  excludeDocketEntries?: boolean;
}) => {
  const rawCaseRecord = await getCaseByDocketNumber({
    docketNumber: Case.formatDocketNumber(docketNumber),
  });

  if (!rawCaseRecord.docketNumber && !rawCaseRecord.entityName) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  const caseDTO = CaseFactory.getCaseDTO({
    rawCase: rawCaseRecord,
    user: undefined,
  }) as PublicCaseDTO | RestrictedCaseDTO;

  if (excludeDocketEntries) {
    return { ...caseDTO, docketEntries: [] };
  }

  return caseDTO;
};
