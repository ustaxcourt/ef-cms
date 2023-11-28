import { MOTION_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  calculateDifferenceInDays,
  prepareDateFromString,
} from '@shared/business/utilities/DateHandler';
import { isLeadCase } from '@shared/business/entities/cases/Case';
import { partition } from 'lodash';

export type FormattedPendingMotionDocketEntry = RawDocketEntry & {
  daysSinceCreated: number;
  caseCaption: string;
  consolidatedGroupCount: number;
  leadDocketNumber?: string;
};

export type DocketEntryWithWorksheet = FormattedPendingMotionDocketEntry & {
  docketEntryWorksheet: RawDocketEntryWorksheet;
};

export const getPendingMotionDocketEntriesForCurrentJudgeInteractor = async (
  applicationContext: IApplicationContext,
  params: { judge: string },
): Promise<{
  docketEntries: DocketEntryWithWorksheet[];
}> => {
  const { judge } = params;
  const authorizedUser = applicationContext.getCurrentUser();
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const docketNumbers = await getDocketNumbersOfCasesWithStatusType(
    applicationContext,
    judge,
  );

  const allCasesByJudge = await Promise.all(
    docketNumbers.map(docketNumber =>
      applicationContext.getPersistenceGateway().getCaseByDocketNumber({
        applicationContext,
        docketNumber,
        includeConsolidatedCases: true,
      }),
    ),
  );
  const pendingMotionDocketEntries = allCasesByJudge.reduce(
    (accumulator, aCase) => {
      const currentCasePendingMotionDocketEntries = (
        aCase.docketEntries as RawDocketEntry[]
      )
        .map(docketEntry => {
          const currentDate = prepareDateFromString().toISO()!;
          const dayDifference = calculateDifferenceInDays(
            currentDate,
            docketEntry.createdAt,
          );

          return {
            ...docketEntry,
            caseCaption: aCase.caseCaption,
            consolidatedGroupCount: aCase.consolidatedCases.length || 1,
            daysSinceCreated: dayDifference,
            leadDocketNumber: aCase.leadDocketNumber,
          };
        })
        .filter(docketEntry => filterPendingMotionDocketEntry(docketEntry));
      return [...accumulator, ...currentCasePendingMotionDocketEntries];
    },
    [] as FormattedPendingMotionDocketEntry[],
  );

  const pendingMotionsDocketEntriesWithWorksheet: DocketEntryWithWorksheet[] =
    await attachDocketEntryWorkSheets(
      applicationContext,
      pendingMotionDocketEntries,
    );

  const uniquePendingMotions: DocketEntryWithWorksheet[] =
    removeDuplicateDocketEntries(pendingMotionsDocketEntriesWithWorksheet);

  return {
    docketEntries: uniquePendingMotions,
  };
};

async function getDocketNumbersOfCasesWithStatusType(
  applicationContext: IApplicationContext,
  judge: string,
): Promise<string[]> {
  return (
    await applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge({
        applicationContext,
        params: {
          judges: [judge],
        },
      })
  ).map(c => c.docketNumber);
}

function filterPendingMotionDocketEntry(
  docketEntry: FormattedPendingMotionDocketEntry,
): boolean {
  return (
    !!docketEntry.pending &&
    MOTION_EVENT_CODES.includes(docketEntry.eventCode) &&
    docketEntry.daysSinceCreated >= 180
  );
}

async function attachDocketEntryWorkSheets(
  applicationContext: IApplicationContext,
  docketEntries: FormattedPendingMotionDocketEntry[],
): Promise<DocketEntryWithWorksheet[]> {
  const docketEntryIds = docketEntries.map(
    docketEntry => docketEntry.docketEntryId,
  );

  const docketEntryWorksheets = await applicationContext
    .getPersistenceGateway()
    .getDocketEntryWorksheetsByDocketEntryIds({
      applicationContext,
      docketEntryIds,
    });

  const docketEntryWorksheetDictionary = docketEntryWorksheets.reduce(
    (accumulator, docketEntryWorksheet) => {
      accumulator[docketEntryWorksheet.docketEntryId] = docketEntryWorksheet;
      return accumulator;
    },
    {} as { [key: string]: RawDocketEntryWorksheet },
  );

  const docketEntriesWithWorksheets: DocketEntryWithWorksheet[] =
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
  docketEntries: DocketEntryWithWorksheet[],
): DocketEntryWithWorksheet[] {
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
    {} as { [key: string]: DocketEntryWithWorksheet },
  );

  return [...soloDocketEntries, ...Object.values(uniqueDocketEntryDictionary)];
}
