import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getDocketEntriesById } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesById';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getConsolidatedCases } from '@web-api/persistence/postgres/cases/getConsolidatedCases';

export const getIsFiledAcrossAllCasesInteractor = async (
  { docketEntryId }: { docketEntryId: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EDIT_ORDER)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const docketEntries = await getDocketEntriesById({ docketEntryId });

  if (docketEntries.length === 0) {
    throw new NotFoundError('Docket entry not found');
  }

  const firstEntry = docketEntries[0];

  const theCase = await getCaseByDocketNumber({ docketNumber: firstEntry.docketNumber });

  if (theCase.leadDocketNumber) {
    const docketNumbersFromEntries = docketEntries.map(entry => entry.docketNumber);

    const allCasesInGroup = await getConsolidatedCases({
      leadDocketNumber: theCase.leadDocketNumber,
      excludeFields: ['docketEntries', 'correspondence', 'hearings', 'privatePractitioners', 'irsPractitioners']
    });

    const allDocketNumbersInGroup = allCasesInGroup.map(c => c.docketNumber);

    const docketNumbersFromEntriesSet = new Set(docketNumbersFromEntries);
    const allDocketNumbersInGroupSet = new Set(allDocketNumbersInGroup);

    return [...allDocketNumbersInGroupSet]
      .every(
        docketNumber => docketNumbersFromEntriesSet.has(docketNumber)
      );
  } else {
    return true;
  }
};
