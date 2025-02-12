import { NotFoundError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { Case } from '@shared/business/entities/cases/Case';
import { isEmpty } from 'lodash';

export const getCaseExistsInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
) => {
  const caseRecord = await getCaseByDocketNumber({
    applicationContext,
    docketNumber: Case.formatDocketNumber(docketNumber),
  });

  if (isEmpty(caseRecord)) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  return !!caseRecord;
};
