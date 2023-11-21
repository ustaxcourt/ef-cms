import { MOTION_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/docketEntryWorksheet';
import { UnauthorizedError } from '@web-api/errors/errors';
import {
  calculateDifferenceInDays,
  prepareDateFromString,
} from '@shared/business/utilities/DateHandler';

export type PendingMotionCasesWithDocketEntryWorksheets = Omit<
  RawCase,
  'docketEntries'
> & {
  docketEntries: (RawDocketEntry & {
    docketEntryWorksheet: RawDocketEntryWorksheet;
  })[];
};

export const getPendingMotionCasesForCurrentJudgeInteractor = async (
  applicationContext: IApplicationContext,
  params: { judges: string[] },
): Promise<{
  cases: PendingMotionCasesWithDocketEntryWorksheets[];
}> => {
  const { judges } = params;
  const authorizedUser = applicationContext.getCurrentUser();
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const docketNumbers = await getDocketNumbersOfCasesWithStatusType(
    applicationContext,
    judges,
  );

  const allCasesByJudge = await Promise.all(
    docketNumbers.map(docketNumber =>
      applicationContext.getPersistenceGateway().getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  const pendingMotionCasesByJudge: RawCase[] = allCasesByJudge.filter(aCase =>
    filterCasesIfPendingMotion(aCase),
  );

  const pendingMotionsCasesWithDocketEntryWorksheet: PendingMotionCasesWithDocketEntryWorksheets[] =
    await attachDocketEntryWorkSheets(
      applicationContext,
      pendingMotionCasesByJudge,
    );

  return {
    cases: pendingMotionsCasesWithDocketEntryWorksheet,
  };
};

async function getDocketNumbersOfCasesWithStatusType(
  applicationContext: IApplicationContext,
  judges: string[],
): Promise<string[]> {
  return (
    await applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge({
        applicationContext,
        params: {
          judges,
        },
      })
  ).map(c => c.docketNumber);
}

function filterCasesIfPendingMotion(aCase: {
  docketEntries: RawDocketEntry[];
}): boolean {
  return aCase.docketEntries.some(docketEntry => {
    return (
      docketEntry.pending &&
      MOTION_EVENT_CODES.includes(docketEntry.eventCode) &&
      isDocketEntryOlderThan180Days(docketEntry.createdAt)
    );
  });

  function isDocketEntryOlderThan180Days(createdAt: string) {
    const currentDate = prepareDateFromString().toISOString();
    const dayDifference = calculateDifferenceInDays(currentDate, createdAt);
    return dayDifference >= 180;
  }
}

async function attachDocketEntryWorkSheets(
  applicationContext: IApplicationContext,
  cases: RawCase[],
): Promise<PendingMotionCasesWithDocketEntryWorksheets[]> {
  const docketEntryIds = cases.reduce((accumulator, aCase) => {
    const ids = aCase.docketEntries.map(
      docketEntry => docketEntry.docketEntryId,
    );
    return [...accumulator, ...ids];
  }, [] as string[]);

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

  const completeCaseRecords = cases.map(aCase => {
    return {
      ...aCase,
      docketEntries: aCase.docketEntries.map(docketEntry => {
        return {
          ...docketEntry,
          docketEntryWorksheet:
            docketEntryWorksheetDictionary[docketEntry.docketEntryId] || {},
        };
      }),
    };
  });
  return completeCaseRecords;
}
