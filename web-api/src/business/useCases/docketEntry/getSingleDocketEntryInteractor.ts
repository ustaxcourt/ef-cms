import {
  INITIAL_DOCUMENT_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  AuthUser,
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { Case } from '@shared/business/entities/cases/Case';
import { getDbReader } from '@web-api/database';
import { verifyCaseForUser } from '@web-api/persistence/postgres/cases/userOnCase/verifyCaseForUser';
import { removeServedParties } from '@shared/business/dto/helpers/removeServedParties';
import {
  stripInternalDocketEntryFields,
  toPublicDocketEntryFields,
} from '@web-api/business/useCases/getCaseDocketEntriesInteractor';

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

  // Preserve the AuthUser reference before isAuthorized (a type guard) narrows it
  const user: AuthUser = authorizedUser;
  const hasFullAccess = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.GET_ALL_CASE_DATA,
  );

  // For non-privileged users, determine association and enforce sealed case rules.
  let isAssociatedOrPrivileged = false;
  if (!hasFullAccess) {
    const isCaseSealed = await checkIfCaseIsSealed(formattedDocketNumber);

    if (user.role === ROLES.irsSuperuser) {
      const petitionServed =
        await computePetitionServedStatus(formattedDocketNumber);
      isAssociatedOrPrivileged = petitionServed;
      if (isCaseSealed && !isAssociatedOrPrivileged) {
        throw new NotFoundError(
          `Docket entry ${docketEntryId} not found for case ${formattedDocketNumber}`,
        );
      }
    } else {
      const isAssociated = await verifyCaseForUser({
        docketNumber: formattedDocketNumber,
        userId: user.userId,
      });
      isAssociatedOrPrivileged = isAssociated;

      if (isCaseSealed && !isAssociated) {
        throw new NotFoundError(
          `Docket entry ${docketEntryId} not found for case ${formattedDocketNumber}`,
        );
      }
    }
  }

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

  let docketEntry = results[0];

  // Users without GET_ALL_CASE_DATA (e.g. external users) can only access
  // docket entries that are on the docket record.
  if (!hasFullAccess && !docketEntry.isOnDocketRecord) {
    throw new NotFoundError(
      `Docket entry ${docketEntryId} not found for case ${formattedDocketNumber}`,
    );
  }

  // STIN filtering: only IRS superuser can see the STIN.
  // petitionsClerk/caseServicesSupervisor can see it only before petition is served.
  if (
    docketEntry.documentType ===
    INITIAL_DOCUMENT_TYPES.stin.documentType
  ) {
    if (user.role === ROLES.irsSuperuser) {
      // IRS superuser can always see STIN — allow through
    } else if (
      user.role === ROLES.petitionsClerk ||
      user.role === ROLES.caseServicesSupervisor
    ) {
      const petitionIsServed =
        await computePetitionServedStatus(formattedDocketNumber);
      if (petitionIsServed) {
        throw new NotFoundError(
          `Docket entry ${docketEntryId} not found for case ${formattedDocketNumber}`,
        );
      }
    } else {
      throw new NotFoundError(
        `Docket entry ${docketEntryId} not found for case ${formattedDocketNumber}`,
      );
    }
  }

  // Apply field-level filtering based on user access
  if (hasFullAccess) {
    // Internal users get full docket entry
  } else if (isAssociatedOrPrivileged) {
    // Associated users get entries with internal fields stripped
    docketEntry = stripInternalDocketEntryFields(docketEntry);
  } else {
    // Unassociated users get PublicDocketEntry-style restricted fields
    docketEntry = toPublicDocketEntryFields(docketEntry);
  }

  // Strip served parties from the response
  [docketEntry] = removeServedParties([docketEntry]);

  return docketEntry;
};

async function checkIfCaseIsSealed(
  docketNumber: string,
): Promise<boolean> {
  const caseRecord = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('docketNumber', '=', docketNumber)
      .select(['sealedDate', 'isSealed'])
      .executeTakeFirst(),
  );
  return !!caseRecord?.isSealed || !!caseRecord?.sealedDate;
}

async function computePetitionServedStatus(
  docketNumber: string,
): Promise<boolean> {
  const petitionEntry = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .where('docketNumber', '=', docketNumber)
      .where('documentType', '=', 'Petition')
      .select(['servedAt'])
      .executeTakeFirst(),
  );
  return !!petitionEntry?.servedAt;
}
