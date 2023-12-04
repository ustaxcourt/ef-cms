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

  const { results: allDocketEntries } = await applicationContext
    .getPersistenceGateway()
    .getAllDocketEntries({ applicationContext, judge }); //rename to pending docket entries

  const currentDate = prepareDateFromString().toISO()!;

  const batchCases = (
    await Promise.all(
      allDocketEntries.map(async (docketEntry: RawDocketEntry) => {
        const fullCase: RawCase = await applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber({
            applicationContext,
            docketNumber: docketEntry.docketNumber,
            includeConsolidatedCases: true,
          });

        const latestDocketEntry: RawDocketEntry = fullCase.docketEntries.find(
          de => de.docketEntryId === docketEntry.docketEntryId,
        );

        const dayDifference = calculateDifferenceInDays(
          currentDate,
          docketEntry.createdAt,
        );

        const updatedDocketEntry: RawDocketEntry & {
          daysSinceCreated: number;
          caseCaption: string;
          consolidatedGroupCount: number;
          leadDocketNumber?: string;
        } = {
          ...docketEntry,
          ...fullCase,
          ...latestDocketEntry,
          consolidatedGroupCount: fullCase.consolidatedCases.length || 1,
          daysSinceCreated: dayDifference,
        };

        return updatedDocketEntry;
      }),
    )
  ).filter(de => de.pending);

  const pendingMotionsDocketEntriesWithWorksheet: DocketEntryWithWorksheet[] =
    await attachDocketEntryWorkSheets(applicationContext, batchCases);

  const uniquePendingMotions: DocketEntryWithWorksheet[] =
    removeDuplicateDocketEntries(pendingMotionsDocketEntriesWithWorksheet);

  return {
    docketEntries: uniquePendingMotions,
  };
};

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
