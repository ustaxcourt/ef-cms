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
  applicationContext: IApplicationContext,
  params: { judgeIds: string[] },
): Promise<{
  docketEntries: FormattedPendingMotionWithWorksheet[];
}> => {
  const { judgeIds } = params;
  const authorizedUser = applicationContext.getCurrentUser();
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_MOTIONS_TABLE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const {
    results: allPendingMotionDocketEntriesOlderThan180DaysFromElasticSearch,
  } = await applicationContext
    .getPersistenceGateway()
    .getAllPendingMotionDocketEntriesForJudge({ applicationContext, judgeIds });

  const currentDate = prepareDateFromString().toISO()!;
  const pendingMotionDocketEntriesOlderThan180DaysFromDynamo =
    await Promise.all(
      allPendingMotionDocketEntriesOlderThan180DaysFromElasticSearch.map(
        async (docketEntry: RawDocketEntry) =>
          await getLatestDataForPendingMotions(
            docketEntry,
            applicationContext,
            currentDate,
          ),
      ),
    );

  const judgePendingMotions =
    pendingMotionDocketEntriesOlderThan180DaysFromDynamo.filter(
      removeMotionsThatHaveBeenHandledInDynamo,
    );

  const judgePendingMotionsWithWorksheet: FormattedPendingMotionWithWorksheet[] =
    await attachDocketEntryWorkSheets(applicationContext, judgePendingMotions);

  const uniquePendingMotions: FormattedPendingMotionWithWorksheet[] =
    removeDuplicateDocketEntries(judgePendingMotionsWithWorksheet);

  return {
    docketEntries: uniquePendingMotions,
  };
};

async function attachDocketEntryWorkSheets(
  applicationContext: IApplicationContext,
  docketEntries: FormattedPendingMotion[],
): Promise<FormattedPendingMotionWithWorksheet[]> {
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

function removeMotionsThatHaveBeenHandledInDynamo(
  docketEntry: FormattedPendingMotion,
) {
  return (
    docketEntry.pending &&
    MOTION_EVENT_CODES.includes(docketEntry.eventCode) &&
    docketEntry.daysSinceCreated >= 180
  );
}

async function getLatestDataForPendingMotions(
  docketEntry: RawDocketEntry,
  applicationContext: IApplicationContext,
  currentDate: string,
): Promise<FormattedPendingMotion> {
  const [caseMetadata, latestDocketEntry] = await Promise.all([
    getCaseMetadata(applicationContext, docketEntry),
    applicationContext.getPersistenceGateway().getDocketEntryOnCase({
      applicationContext,
      docketEntryId: docketEntry.docketEntryId,
      docketNumber: docketEntry.docketNumber,
    }),
  ]);

  const dayDifference = calculateDifferenceInDays(
    currentDate,
    latestDocketEntry.filingDate,
  );

  const updatedDocketEntry: FormattedPendingMotion = {
    caseCaption: caseMetadata.caseCaption,
    consolidatedGroupCount: caseMetadata.consolidatedCaseCount,
    daysSinceCreated: dayDifference,
    docketEntryId: latestDocketEntry.docketEntryId,
    docketNumber: caseMetadata.docketNumber,
    docketNumberWithSuffix: caseMetadata.docketNumberWithSuffix,
    eventCode: latestDocketEntry.eventCode,
    filingDate: latestDocketEntry.filingDate,
    judge: caseMetadata.associatedJudge,
    leadDocketNumber: caseMetadata.leadDocketNumber,
    pending: latestDocketEntry.pending || false,
  };

  return updatedDocketEntry;
}

async function getCaseMetadata(
  applicationContext: IApplicationContext,
  docketEntry: RawDocketEntry,
): Promise<RawCase & { consolidatedCaseCount: number }> {
  const caseMetadata: RawCase = await applicationContext
    .getPersistenceGateway()
    .getCaseMetadataByDocketNumber({
      applicationContext,
      docketNumber: docketEntry.docketNumber,
    });

  const consolidatedCaseCount = caseMetadata.leadDocketNumber
    ? await applicationContext
        .getPersistenceGateway()
        .getConsolidatedCasesCount({
          applicationContext,
          leadDocketNumber: caseMetadata.leadDocketNumber,
        })
    : 1;

  return {
    ...caseMetadata,
    consolidatedCaseCount,
  };
}
