import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { Case } from '@shared/business/entities/cases/Case';

export const getSingleDocketEntryInteractor = async (
  {
    docketEntryId,
    docketNumber,
  }: {
    docketEntryId: string;
    docketNumber: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<RawDocketEntry> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(
      `Invalid User attempting to view docket entry ${docketEntryId} for case ${docketNumber}`,
    );
  }

  const formattedDocketNumber = Case.formatDocketNumber(docketNumber);

  const results = await getDocketEntriesByDocketNumberAndDocketEntryId({
    docketNumbersAndIds: [
      {
        docketEntryId,
        docketNumber: formattedDocketNumber,
      },
    ],
  });

  if (results.length === 0) {
    throw new NotFoundError(
      `Docket entry ${docketEntryId} not found for case ${formattedDocketNumber}`,
    );
  }

  const docketEntry = results[0];

  // Users without GET_ALL_CASE_DATA (e.g. external users) can only access
  // docket entries that are on the docket record. This mirrors the filtering
  // in getCaseDocketEntriesInteractor and CaseFactory.
  const hasFullAccess = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.GET_ALL_CASE_DATA,
  );

  if (!hasFullAccess && !docketEntry.isOnDocketRecord) {
    throw new NotFoundError(
      `Docket entry ${docketEntryId} not found for case ${formattedDocketNumber}`,
    );
  }

  return docketEntry;
};
