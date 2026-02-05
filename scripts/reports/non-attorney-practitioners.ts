#!/usr/bin/env -S npx ts-node --transpile-only

// usages:
// scripts/reports/non-attorney-practitioners.ts > ~/Desktop/non-attorney-practitioners.csv
// scripts/reports/non-attorney-practitioners.ts --stats > ~/Desktop/non-attorney-practitioners-stats.csv

import type { RawPractitioner } from '@shared/business/entities/Practitioner';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  calculateDifferenceInDays,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { formatCaseCaption } from '../helpers/formatters';
import { fromKyselyUser } from '@web-api/persistence/postgres/users/mapper';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getDbReader } from '@web-api/database';
import { pick, sortBy } from 'lodash';
import { substantiveEventCodes } from './non-attorney-practitioners-constants';

const scriptConfig: ScriptConfig = {
  description:
    'non-attorney-practitioners - Generates a spreadsheet of cases in which ' +
    'a non-attorney practitioner appears or a spreadsheet of non-attorney ' +
    'practitioner statistics.',
  environment: {
    environmentName: 'ENV',
  },
  parameters: {
    stats: {
      default: false,
      short: 's',
      type: 'boolean',
    },
  },
  requireActiveAwsSession: true,
};
const { stats } = parseArgsAndEnvVars(scriptConfig) as { stats: boolean };

type tCase = Omit<
  RawCase,
  'hearings' | 'irsPractitioners' | 'correspondence' | 'consolidatedCases'
>;
type tUsersCase = {
  caseCaption: string;
  closedByStipulatedDecision: boolean;
  closedDate?: string;
  closedDateFormatted: string;
  docketNumber: string;
  duration: number;
  hasNoticeOfAppeal: boolean;
  noticeOfTrialDate?: string;
  noticeOfTrialDateFormatted: string;
  privatePractitioners?: RawPractitioner[];
  procedureType: string;
  receivedAt?: string;
  receivedAtFormatted: string;
  status: string;
  trialDate?: string;
  trialDateFormatted: string;
  trialSessionId?: string;
  userFiledPretrialMemorandum: boolean;
  usersDocumentsCount: number;
  usersSubstantiveDocumentsCount: number;
  wentToTrial: boolean;
};
type tNonAttorney = {
  barNumber: string;
  name: string;
  userId: string;
};
type tNonAttorneyStats = {
  totalCases: number;
  totalClosedByStipDecision: number;
  totalDocs: number;
  totalPretrialMemorandums: number;
  totalSubstantiveDocs: number;
  totalThatWentToTrial: number;
};

const formatNonAttorneys = ({
  results,
}: {
  results: any[];
}): { [key: string]: tNonAttorney } => {
  const nonAttorneys = {};
  for (const hit of results) {
    if (hit.userId) {
      nonAttorneys[hit.userId] = {
        ...pick(hit, ['barNumber', 'name']),
        userId: hit.userId,
      };
    }
  }
  return nonAttorneys;
};

const retrieveNonAttorneys = async (): Promise<{
  [key: string]: tNonAttorney;
}> => {
  const results = (
    await getDbReader(reader =>
      reader
        .selectFrom('dwUser as u')
        .selectAll('u')
        // .where('u.admissionsStatus', '=', 'Active')
        .where('u.practitionerType', '=', 'Non-Attorney')
        .orderBy('u.admissionsDate', 'asc')
        .execute(),
    )
  ).map(fromKyselyUser) as RawPractitioner[];
  return formatNonAttorneys({ results });
};

const retrieveNonAttorneysCases = async (): Promise<tCase[]> => {
  const docketNumbers = (
    await getDbReader(reader =>
      reader
        .selectFrom('dwCase as c')
        .innerJoin('dwUserOnCase as uc', 'c.docketNumber', 'uc.docketNumber')
        .innerJoin('dwUser as u', 'uc.userId', 'u.userId')
        .select('c.docketNumber')
        .where('u.practitionerType', '=', 'Non-Attorney')
        .orderBy('c.sortableDocketNumber', 'asc')
        .execute(),
    )
  ).map(c => c.docketNumber);
  return await getCasesByDocketNumbers({
    docketNumbers,
    excludeFields: ['irsPractitioners', 'correspondence', 'hearings'],
  });
};

const getUsersCases = ({
  cases,
  userId,
}: {
  cases: tCase[];
  userId: string;
}): tUsersCase[] => {
  const usersCases: tUsersCase[] = [];
  const casesFiltered = cases.filter(c => {
    const privatePractitionerIds =
      c.privatePractitioners?.map(pp => pp.userId) ?? [];
    return privatePractitionerIds.includes(userId);
  });
  for (const caseRecord of casesFiltered) {
    usersCases.push({
      ...pick(caseRecord, [
        'closedDate',
        'docketNumber',
        'noticeOfTrialDate',
        'procedureType',
        'receivedAt',
        'status',
        'trialDate',
        'trialSessionId',
      ]),
      caseCaption: formatCaseCaption(caseRecord.caseCaption),
      closedByStipulatedDecision: closedByStipulatedDecision(caseRecord),
      closedDateFormatted: caseRecord.closedDate
        ? formatDateString(caseRecord.closedDate, 'MMDDYYYY')
        : '',
      duration: calculateCaseDuration(caseRecord),
      hasNoticeOfAppeal: hasNoticeOfAppeal(caseRecord),
      noticeOfTrialDateFormatted: caseRecord.noticeOfTrialDate
        ? formatDateString(caseRecord.noticeOfTrialDate, 'MMDDYYYY')
        : '',
      receivedAtFormatted: caseRecord.receivedAt
        ? formatDateString(caseRecord.receivedAt, 'MMDDYYYY')
        : '',
      trialDateFormatted: caseRecord.trialDate
        ? formatDateString(caseRecord.trialDate, 'MMDDYYYY')
        : '',
      userFiledPretrialMemorandum: userFiledPretrialMemorandum(
        caseRecord,
        userId,
      ),
      usersDocumentsCount: countUsersDocumentsFiled(caseRecord, userId),
      usersSubstantiveDocumentsCount: countUsersSubstantiveDocumentsFiled(
        caseRecord,
        userId,
      ),
      wentToTrial: wentToTrial(caseRecord),
    });
  }
  return usersCases;
};

const calculateCaseDuration = (caseRecord: tCase): number => {
  if (!caseRecord.receivedAt) {
    return 0;
  }
  const initialClosureDate = determineInitialClosureDate(caseRecord);
  if (!initialClosureDate) {
    return 0;
  }
  const initialDuration = calculateDifferenceInDays(
    initialClosureDate,
    caseRecord.receivedAt,
  );
  if (hasNoticeOfAppeal(caseRecord) && caseRecord.closedDate) {
    const reopenDate = determineCaseReopenDate(caseRecord);
    const appealDuration = calculateDifferenceInDays(
      caseRecord.closedDate,
      reopenDate,
    );
    return initialDuration + appealDuration;
  }
  return initialDuration;
};

const closedByStipulatedDecision = (caseRecord: tCase): boolean => {
  return hasDocumentWithEventCodes(caseRecord, ['SDEC']);
};

const countUsersDocumentsFiled = (
  caseRecord: tCase,
  userId: string,
): number => {
  return (
    caseRecord.docketEntries?.filter(de => {
      return de.userId === userId;
    }).length || 0
  );
};

const countUsersSubstantiveDocumentsFiled = (
  caseRecord: tCase,
  userId: string,
): number => {
  return (
    caseRecord.docketEntries?.filter(de => {
      return (
        de.userId === userId && substantiveEventCodes.includes(de.eventCode)
      );
    }).length || 0
  );
};

const determineCaseReopenDate = (caseRecord: tCase): string => {
  return determineDateOfFirstDocketEntryWithEventCodes(caseRecord, ['NOA']);
};

const determineDateOfFirstDocketEntryWithEventCodes = (
  caseRecord: tCase,
  eventCodes: string[],
  reverse: boolean = false,
): string => {
  const docsSorted = reverse
    ? sortBy(caseRecord.docketEntries, 'receivedAt').reverse()
    : sortBy(caseRecord.docketEntries, 'receivedAt');
  const docs = docsSorted.filter(de => {
    return eventCodes.includes(de.eventCode);
  });
  if (docs.length > 0 && 'receivedAt' in docs[0] && docs[0].receivedAt) {
    return docs[0]['receivedAt'];
  }
  return '';
};

const determineInitialClosureDate = (caseRecord: tCase): string => {
  const firstDecisionDocReceivedDate =
    determineDateOfFirstDocketEntryWithEventCodes(caseRecord, [
      'ODD',
      'DEC',
      'OAD',
      'SDEC',
    ]);
  return firstDecisionDocReceivedDate || caseRecord.closedDate || '';
};

const hasDocumentWithEventCodes = (
  caseRecord: tCase,
  eventCodes: string[],
): boolean => {
  return !!(
    caseRecord.docketEntries &&
    caseRecord.docketEntries.length &&
    caseRecord.docketEntries.filter(de => {
      return eventCodes.includes(de.eventCode);
    }).length > 0
  );
};

const hasDocumentWithEventCodesFiledByUser = (
  caseRecord: tCase,
  eventCodes: string[],
  userId: string,
): boolean => {
  return !!(
    caseRecord.docketEntries &&
    caseRecord.docketEntries.length &&
    caseRecord.docketEntries.filter(de => {
      return de.userId === userId && eventCodes.includes(de.eventCode);
    }).length > 0
  );
};

const hasNoticeOfAppeal = (caseRecord: tCase): boolean => {
  return hasDocumentWithEventCodes(caseRecord, ['NOA']);
};

const userFiledPretrialMemorandum = (
  caseRecord: tCase,
  userId: string,
): boolean => {
  return hasDocumentWithEventCodesFiledByUser(
    caseRecord,
    ['PHM', 'PMT'],
    userId,
  );
};

const wentToTrial = (caseRecord: tCase) => {
  return !!(caseRecord.trialSessionId || caseRecord.trialDate);
};

const generateCompositeStatistics = ({
  usersCases,
}: {
  usersCases: tUsersCase[];
}): tNonAttorneyStats => {
  const nonAttorneyStats: tNonAttorneyStats = {
    totalCases: usersCases.length,
    totalClosedByStipDecision: 0,
    totalDocs: 0,
    totalPretrialMemorandums: 0,
    totalSubstantiveDocs: 0,
    totalThatWentToTrial: 0,
  };
  for (const uc of usersCases) {
    if (uc.closedByStipulatedDecision) {
      nonAttorneyStats.totalClosedByStipDecision++;
    }
    if (uc.wentToTrial) {
      nonAttorneyStats.totalThatWentToTrial++;
    }
    if (uc.userFiledPretrialMemorandum) {
      nonAttorneyStats.totalPretrialMemorandums++;
    }
    nonAttorneyStats.totalDocs += uc.usersDocumentsCount;
    nonAttorneyStats.totalSubstantiveDocs += uc.usersSubstantiveDocumentsCount;
  }
  return nonAttorneyStats;
};

const outputHeader = (): void => {
  console.log(
    '"Bar Number","Name","Docket Number","Procedure Type","Case Caption","Case Status","Documents Filed",' +
      '"Substantive Documents Filed","Filed Pretrial Memorandum","Closed by Stipulated Decision","Went to Trial",' +
      '"Date of Receipt of Petition","Date of Notice of Trial","Date Closed","Total Duration in Days",' +
      '"Trial Date","Has Notice of Appeal"',
  );
};

const outputRow = ({
  nonAttorney,
  usersCase,
}: {
  nonAttorney: tNonAttorney;
  usersCase: tUsersCase;
}): void => {
  console.log(
    `"${nonAttorney.barNumber}","${nonAttorney.name}","${usersCase.docketNumber}",` +
      `"${usersCase.procedureType || ''}","${usersCase.caseCaption}","${usersCase.status}",` +
      `"${usersCase.usersDocumentsCount}","${usersCase.usersSubstantiveDocumentsCount}",` +
      `"${usersCase.userFiledPretrialMemorandum}","${usersCase.closedByStipulatedDecision}",` +
      `"${usersCase.wentToTrial}","${usersCase.receivedAtFormatted}","${usersCase.noticeOfTrialDateFormatted}",` +
      `"${usersCase.closedDateFormatted}","${usersCase.duration}","${usersCase.trialDateFormatted}",` +
      `"${usersCase.hasNoticeOfAppeal}"`,
  );
};

const outputStatsHeader = (): void => {
  console.log(
    '"Bar Number","Name","Total Cases","Total Documents Filed","Total Substantive Documents Filed","Total Pretrial ' +
      'Memorandums Filed","Total Cases Closed by Stipulated Decision","Total Cases that Went to Trial",',
  );
};

const outputStatsRow = ({
  nonAttorney,
  nonAttorneyStats,
}: {
  nonAttorney: tNonAttorney;
  nonAttorneyStats: tNonAttorneyStats;
}): void => {
  console.log(
    `"${nonAttorney.barNumber}","${nonAttorney.name}","${nonAttorneyStats.totalCases}",` +
      `"${nonAttorneyStats.totalDocs}","${nonAttorneyStats.totalSubstantiveDocs}",` +
      `"${nonAttorneyStats.totalPretrialMemorandums}","${nonAttorneyStats.totalClosedByStipDecision}",` +
      `"${nonAttorneyStats.totalThatWentToTrial}"`,
  );
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const nonAttorneys = await retrieveNonAttorneys();
  const cases = await retrieveNonAttorneysCases();
  if (stats) {
    outputStatsHeader();
  } else {
    outputHeader();
  }
  for (const userId of Object.keys(nonAttorneys)) {
    const usersCases = getUsersCases({ cases, userId });
    if (stats) {
      const nonAttorneyStats = generateCompositeStatistics({ usersCases });
      outputStatsRow({ nonAttorney: nonAttorneys[userId], nonAttorneyStats });
    } else {
      for (const uc of usersCases) {
        outputRow({ nonAttorney: nonAttorneys[userId], usersCase: uc });
      }
    }
  }
})();
