import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import type { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';

let trialSessionsCache: RawTrialSession[] = [];

export const getUniqueValues = ({
  arrayOfObjects,
  keyToFilter,
}: {
  arrayOfObjects: {}[];
  keyToFilter: string;
}): { [key: string]: number } => {
  const uniqueValues = {};
  for (const someObj of arrayOfObjects) {
    if (keyToFilter in someObj) {
      if (someObj[keyToFilter] in uniqueValues) {
        uniqueValues[someObj[keyToFilter]]++;
      } else {
        uniqueValues[someObj[keyToFilter]] = 1;
      }
    }
  }
  return uniqueValues;
};

const getTrialSessions = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<RawTrialSession[]> => {
  if (trialSessionsCache.length === 0) {
    trialSessionsCache = await applicationContext
      .getPersistenceGateway()
      .getTrialSessions({
        applicationContext,
      });
  }

  return trialSessionsCache;
};

const getTrialSessionsInTimeframe = async ({
  applicationContext,
  end,
  start,
}: {
  applicationContext: IApplicationContext;
  end: string;
  start: string;
}): Promise<RawTrialSession[]> => {
  const trialSessions = await getTrialSessions({ applicationContext });
  const yearSessions = trialSessions.filter(
    session =>
      session.startDate &&
      session.startDate >= start &&
      session.startDate <= end,
  );
  yearSessions.sort((a, b) => a.startDate.localeCompare(b.startDate));
  return yearSessions;
};

const outputTrialSessionsReport = ({
  trialSessions,
}: {
  trialSessions: RawTrialSession[];
}): void => {
  console.log(
    'Start Date,Location,Session Type,Proceeding Type,Judge,Trial Clerk',
  );
  for (const s of trialSessions) {
    const startDate = formatDateString(s.startDate, FORMATS['MMDDYYYY_DASHED']);
    let trialClerk = '';
    if (s.trialClerk && 'name' in s.trialClerk && s.trialClerk.name) {
      trialClerk = s.trialClerk.name;
    } else if (s.alternateTrialClerkName) {
      trialClerk = s.alternateTrialClerkName;
    }
    const judgeName =
      s.judge && 'name' in s.judge && s.judge.name ? s.judge.name : '';
    console.log(
      `"${startDate}","${s.trialLocation}","${s.sessionType}","${s.proceedingType}","${judgeName}","${trialClerk}"`,
    );
  }
};

const outputTrialSessionsStats = ({
  trialSessions,
}: {
  trialSessions: RawTrialSession[];
}): void => {
  const locations = getUniqueValues({
    arrayOfObjects: trialSessions,
    keyToFilter: 'trialLocation',
  });
  const sessionTypes = getUniqueValues({
    arrayOfObjects: trialSessions,
    keyToFilter: 'sessionType',
  });
  const proceedingTypes = getUniqueValues({
    arrayOfObjects: trialSessions,
    keyToFilter: 'proceedingType',
  });
  const judges = getUniqueValues({
    arrayOfObjects: trialSessions.map(s => {
      return { judgeName: s.judge?.name || '' };
    }),
    keyToFilter: 'judgeName',
  });
  console.log({
    judges,
    locations,
    proceedingTypes,
    sessionTypes,
    total: trialSessions.length,
  });
};

export const trialSessionsReport = async ({
  applicationContext,
  end,
  start,
  stats,
}: {
  applicationContext: IApplicationContext;
  end: string;
  start: string;
  stats: boolean;
}): Promise<void> => {
  const trialSessions = await getTrialSessionsInTimeframe({
    applicationContext,
    end,
    start,
  });
  if (stats) {
    outputTrialSessionsStats({ trialSessions });
  } else {
    outputTrialSessionsReport({ trialSessions });
  }
};
