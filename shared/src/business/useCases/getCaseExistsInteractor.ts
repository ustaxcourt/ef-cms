import { NotFoundError } from '@web-api/errors/errors';
import { Case } from '@shared/business/entities/cases/Case';
import { getCaseMetadataByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';

export const getCaseExistsInteractor = async ({
  docketNumber,
}: {
  docketNumber: string;
}) => {
  const caseRecord = await getCaseMetadataByDocketNumber({
    docketNumber: Case.formatDocketNumber(docketNumber),
  });

  if (!caseRecord) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  return !!caseRecord;
};
