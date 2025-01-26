import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { type RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { type ServerApplicationContext } from '@web-api/applicationContext';
import { generateCsv } from '../helpers/generate-csv';
import { pick } from 'lodash';

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
  applicationContext: ServerApplicationContext;
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
  applicationContext: ServerApplicationContext;
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
  filename,
  trialSessions,
}: {
  filename: string;
  trialSessions: RawTrialSession[];
}): void => {
  const columns = [
    { header: 'Start Date', key: 'startDate' },
    { header: 'Location', key: 'trialLocation' },
    { header: 'Session Type', key: 'sessionType' },
    { header: 'Proceeding Type', key: 'proceedingType' },
    { header: 'Judge', key: 'judge' },
    { header: 'Trial Clerk', key: 'trialClerk' },
  ];
  const rows = trialSessions.map(s => {
    const startDate = formatDateString(s.startDate, FORMATS['MMDDYYYY_DASHED']);
    let trialClerk = '';
    if (s.trialClerk && 'name' in s.trialClerk && s.trialClerk.name) {
      trialClerk = s.trialClerk.name;
    } else if (s.alternateTrialClerkName) {
      trialClerk = s.alternateTrialClerkName;
    }
    const judge = s.judge?.name ?? '';
    return {
      ...pick(s, ['proceedingType', 'sessionType', 'trialLocation']),
      judge,
      startDate,
      trialClerk,
    };
  });
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
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
  filename,
  start,
  stats,
}: {
  applicationContext: ServerApplicationContext;
  end: string;
  filename: string;
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
    outputTrialSessionsReport({ filename, trialSessions });
  }
};
