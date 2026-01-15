import { Case } from '@shared/business/entities/cases/Case';
import { CaseFactory } from '@shared/business/entities/cases/CaseFactory';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { CaseDTO } from '../dto/docketEntries/CaseDTO';
import { RestrictedCaseDTO } from '../dto/docketEntries/RestrictedCaseDTO';
import { PublicCaseDTO } from '../dto/docketEntries/PublicCaseDTO';

export const getCaseInteractor = async (
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<CaseDTO | RestrictedCaseDTO | PublicCaseDTO> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view docket Number: ${docketNumber}`,
    );
  }

  const [caseRecord, workItems] = await Promise.all([
    getCaseByDocketNumber({
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

  // The UI needs some work item info associated with the docket entry, so we attach that here
  const workItemByDocketEntryId = new Map<string, (typeof workItems)[0]>(
    workItems.map(wi => [wi.docketEntryId, wi]),
  );
  const docketEntriesWithUIInfo = theCase.docketEntries.map(docketEntry => {
    const workItem = workItemByDocketEntryId.get(docketEntry.docketEntryId);

    return {
      ...docketEntry,
      qcComplete: !!workItem?.completedAt,
      qcViewed: !!workItem?.isRead,
      workItemId: workItem?.workItemId,
    };
  });

  if (theCase.entityName === 'PublicCase') {
    return new PublicCaseDTO({
      ...(theCase.toRawObject() as RawPublicCase),
      docketEntries: docketEntriesWithUIInfo,
    });
  } else if (theCase.entityName === 'RestrictedCase') {
    return new RestrictedCaseDTO({
      ...(theCase.toRawObject() as RawRestrictedCase),
      docketEntries: docketEntriesWithUIInfo,
    });
  }

  // should return as a 'Case'
  return new CaseDTO({
    ...(theCase.toRawObject() as RawCase),
    docketEntries: docketEntriesWithUIInfo,
  });
};
