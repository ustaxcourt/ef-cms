import { NotFoundError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';

export const getDocketEntryProcessingStatusInteractor = async (
  _applicationContext: ServerApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
  _authorizedUser: UnknownAuthUser,
): Promise<{ processingStatus: string }> => {
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
