import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@web-api/business/entities/cases/CaseFactory';
import { NotFoundError } from '@web-api/errors/errors';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { PublicCaseResponse } from '@shared/business/dto/cases/PublicCaseResponse';
import { RestrictedCaseResponse } from '@shared/business/dto/cases/RestrictedCaseResponse';

export const getPublicCaseInteractor = async ({
  docketNumber,
  excludeDocketEntries,
}: {
  docketNumber: string;
  excludeDocketEntries?: boolean;
}): Promise<PublicCaseResponse | RestrictedCaseResponse> => {
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
  }) as PublicCaseResponse | RestrictedCaseResponse;

  if (excludeDocketEntries) {
    caseDTO.docketEntries = [];
  }

  return caseDTO;
};
