import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';

export const getDocketEntryProcessingStatusInteractor = async (
  _applicationContext: ServerApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<{ processingStatus: string }> => {
  const caseRecord = await getCaseByDocketNumber({ docketNumber });

  if (!caseRecord?.docketNumber) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const caseEntity = new Case(caseRecord, { authorizedUser });

  if (!authorizedUser) {
    throw new UnauthorizedError('Unauthorized');
  }
  if (
    !User.isInternalUser(authorizedUser.role) &&
    !caseEntity.userHasAccessToCase(authorizedUser)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const [docketEntry] = await getDocketEntriesByDocketNumberAndDocketEntryId({
    docketNumbersAndIds: [{ docketEntryId, docketNumber }],
    selectFields: ['processingStatus'],
  });

  if (!docketEntry) {
    throw new NotFoundError(
      `Docket entry ${docketEntryId} not found on case ${docketNumber}`,
    );
  }

  return { processingStatus: docketEntry.processingStatus };
};
