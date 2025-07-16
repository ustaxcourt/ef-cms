import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getAllPendingMotionDocketEntriesForJudge } from '@web-api/persistence/postgres/docketEntries/reports/getAllPendingMotionDocketEntriesForJudge';
import { isLeadCase } from '@shared/business/entities/cases/Case';
import { partition } from 'lodash';
import { getDocketEntryWorksheetsByDocketEntryIds } from '@web-api/persistence/postgres/docketEntryWorksheets/getDocketEntryWorksheetsByDocketEntryIds';

export type FormattedPendingMotion = {
  docketNumber: string;
  docketNumberWithSuffix?: string;
  docketEntryId: string;
  eventCode: string;
  daysSinceCreated: number;
  pending: boolean;
  caseCaption: string;
  filingDate: string;
  consolidatedGroupCount: number;
  leadDocketNumber?: string;
  judge?: string;
};

export type FormattedPendingMotionWithWorksheet = FormattedPendingMotion & {
  docketEntryWorksheet: RawDocketEntryWorksheet;
};

export const getPendingMotionDocketEntriesForCurrentJudgeInteractor = async (
  params: { judgeIds: string[] },
  authorizedUser: UnknownAuthUser,
): Promise<{
  docketEntries: FormattedPendingMotionWithWorksheet[];
}> => {
  const { judgeIds } = params;
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_MOTIONS_TABLE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { results: allPendingMotionDocketEntriesOlderThan180Days } =
    await getAllPendingMotionDocketEntriesForJudge({ judgeIds });

  const judgePendingMotionsWithWorksheet: FormattedPendingMotionWithWorksheet[] =
    await attachDocketEntryWorkSheets(
      allPendingMotionDocketEntriesOlderThan180Days,
    );

  const uniquePendingMotions: FormattedPendingMotionWithWorksheet[] =
    removeDuplicateDocketEntries(judgePendingMotionsWithWorksheet);

  return {
    docketEntries: uniquePendingMotions,
  };
};

async function attachDocketEntryWorkSheets(
  docketEntries: FormattedPendingMotion[],
): Promise<FormattedPendingMotionWithWorksheet[]> {
  const docketEntryIds = docketEntries.map(
    docketEntry => docketEntry.docketEntryId,
  );

  const docketEntryWorksheets = await getDocketEntryWorksheetsByDocketEntryIds({
    docketEntryIds,
  });

  const docketEntryWorksheetDictionary = docketEntryWorksheets.reduce(
    (accumulator, docketEntryWorksheet) => {
      accumulator[docketEntryWorksheet.docketEntryId] = docketEntryWorksheet;
      return accumulator;
    },
    {} as { [key: string]: RawDocketEntryWorksheet },
  );

  const docketEntriesWithWorksheets: FormattedPendingMotionWithWorksheet[] =
    docketEntries.map(docketEntry => {
      return {
        ...docketEntry,
        docketEntryWorksheet: docketEntryWorksheetDictionary[
          docketEntry.docketEntryId
        ] || { docketEntryId: docketEntry.docketEntryId },
      };
    });

  return docketEntriesWithWorksheets;
}

function removeDuplicateDocketEntries(
  docketEntries: FormattedPendingMotionWithWorksheet[],
): FormattedPendingMotionWithWorksheet[] {
  const [docketEntriesWithLead, soloDocketEntries] = partition(
    docketEntries,
    de => !!de.leadDocketNumber,
  );

  const uniqueDocketEntryDictionary = docketEntriesWithLead.reduce(
    (accumulator, docketEntry) => {
      if (!accumulator[docketEntry.docketEntryId]) {
        accumulator[docketEntry.docketEntryId] = docketEntry;
        return accumulator;
      }
      if (isLeadCase(docketEntry)) {
        accumulator[docketEntry.docketEntryId] = docketEntry;
        return accumulator;
      }

      return accumulator;
    },
    {} as { [key: string]: FormattedPendingMotionWithWorksheet },
  );

  return [...soloDocketEntries, ...Object.values(uniqueDocketEntryDictionary)];
}
