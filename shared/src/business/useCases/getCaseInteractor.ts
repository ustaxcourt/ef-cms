import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { DocketEntry } from '@shared/business/entities/DocketEntry';

export const getCaseInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view docket Number: ${docketNumber}`,
    );
  }

  const [caseRecord, workItems] = await Promise.all([
    getCaseByDocketNumber({
      applicationContext,
      docketNumber: Case.formatDocketNumber(docketNumber),
      user: authorizedUser,
    }),
    getWorkItemsByDocketNumber({
      docketNumber: Case.formatDocketNumber(docketNumber),
    }),
  ]);

  const isValidCase = Boolean(caseRecord?.docketNumber);

  if (!isValidCase) {
    const error = new NotFoundError(`Case ${docketNumber} was not found.`);
    error.skipLogging = true;
    throw error;
  }

  const theCase = CaseFactory.getCase({
    rawCase: caseRecord,
    user: authorizedUser,
  });
  for (const docketEntry of theCase.docketEntries) {
    for (const workItem of workItems) {
      if (docketEntry.docketEntryId === workItem.docketEntryId) {
        DocketEntry.attachWorkItemInfoForUI(docketEntry, workItem);
      }
    }
  }
  return theCase;
};
