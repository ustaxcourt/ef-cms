import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { type RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { alphabetizeCities, formatJudgeName } from '../helpers/formatters';
import { generateCsv } from '../helpers/generate-csv';
import { getTrialSessions } from '@web-api/persistence/postgres/trialSessions/getTrialSessions';
import { pick } from 'lodash';

let trialSessionsCache: RawTrialSession[] = [];

export const clearTrialSessionsCache = (): void => {
  trialSessionsCache = [];
};

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

const getTrialSessionsCache = async (): Promise<RawTrialSession[]> => {
  if (trialSessionsCache.length === 0) {
    trialSessionsCache = await getTrialSessions();
  }

  return trialSessionsCache;
};

const getTrialSessionsInTimeframe = async ({
  begin,
  end,
}: {
  begin: string;
  end: string;
}): Promise<RawTrialSession[]> => {
  const trialSessions = await getTrialSessionsCache();
  const yearSessions = trialSessions.filter(
    session =>
      session.startDate &&
      session.startDate >= begin &&
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
    if (s.trialClerk && s.trialClerk?.name) {
      trialClerk = s.trialClerk.name.trim();
    } else if (s.alternateTrialClerkName) {
      trialClerk = s.alternateTrialClerkName.trim();
    }
    const judge = formatJudgeName(s.judge?.name);
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
  const unsortedLocations = getUniqueValues({
    arrayOfObjects: trialSessions,
    keyToFilter: 'trialLocation',
  });
  const unsortedSessionTypes = getUniqueValues({
    arrayOfObjects: trialSessions,
    keyToFilter: 'sessionType',
  });
  const unsortedProceedingTypes = getUniqueValues({
    arrayOfObjects: trialSessions,
    keyToFilter: 'proceedingType',
  });
  const unsortedJudges = getUniqueValues({
    arrayOfObjects: trialSessions.map(s => ({
      judgeName: formatJudgeName(s.judge?.name),
    })),
    keyToFilter: 'judgeName',
  });
  const justClerks: { trialClerk: string }[] = trialSessions.map(s => {
    let trialClerk = '';
    if (s.trialClerk && s.trialClerk?.name) {
      trialClerk = s.trialClerk.name.trim();
    } else if (s.alternateTrialClerkName) {
      trialClerk = s.alternateTrialClerkName.trim();
    }
    return { trialClerk };
  });
  const unsortedTrialClerks = getUniqueValues({
    arrayOfObjects: justClerks,
    keyToFilter: 'trialClerk',
  });

  const locations = {};
  alphabetizeCities(Object.keys(unsortedLocations)).forEach(key => {
    locations[key] = unsortedLocations[key];
  });

  const sessionTypes = {};
  Object.keys(unsortedSessionTypes)
    .sort((a, b) => unsortedSessionTypes[b] - unsortedSessionTypes[a])
    .forEach(key => {
      sessionTypes[key] = unsortedSessionTypes[key];
    });

  const proceedingTypes = {};
  Object.keys(unsortedProceedingTypes)
    .sort((a, b) => a.localeCompare(b))
    .forEach(key => {
      proceedingTypes[key] = unsortedProceedingTypes[key];
    });

  const judges = {};
  Object.keys(unsortedJudges)
    .sort((a, b) => {
      if (a === '') return 1;
      if (b === '') return -1;
      return a.localeCompare(b);
    })
    .forEach(key => {
      judges[key] = unsortedJudges[key];
    });

  const trialClerks = {};
  Object.keys(unsortedTrialClerks)
    .sort((a, b) => {
      if (a === '') return 1;
      if (b === '') return -1;
      return a.localeCompare(b);
    })
    .forEach(key => {
      trialClerks[key] = unsortedTrialClerks[key];
    });

  console.log({
    judges,
    locations,
    proceedingTypes,
    sessionTypes,
    trialClerks,
    total: trialSessions.length,
  });
};

export const trialSessionsReport = async ({
  begin,
  end,
  filename,
  stats,
}: {
  begin: string;
  end: string;
  filename: string;
  stats: boolean;
}): Promise<void> => {
  const trialSessions = await getTrialSessionsInTimeframe({
    begin,
    end,
  });
  if (stats) {
    outputTrialSessionsStats({ trialSessions });
  } else {
    outputTrialSessionsReport({ filename, trialSessions });
  }
};
