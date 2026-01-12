import { NotFoundError } from '@web-api/errors/errors';
import { Case } from '@shared/business/entities/cases/Case';
import { getCaseExists } from '@web-api/persistence/postgres/cases/getCaseExists';

export const getCaseExistsInteractor = async ({
  docketNumber,
}: {
  docketNumber: string;
}) => {
  const caseExists = await getCaseExists({
    docketNumber: Case.formatDocketNumber(docketNumber),
  });

  if (!caseExists) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  return caseExists;
};
