// usages:
// npx ts-node --transpile-only scripts/reports/non-attorney-practitioners.ts > ~/Desktop/non-attorney-practitioners.csv
// npx ts-node --transpile-only scripts/reports/non-attorney-practitioners.ts --stats > ~/Desktop/non-attorney-practitioners-stats.csv

import {
  calculateDifferenceInDays,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { createApplicationContext } from '@web-api/applicationContext';
import { pick, sortBy } from 'lodash';
import { requireEnvVars } from '../../shared/admin-tools/util';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';
import { substantiveEventCodes } from './non-attorney-practitioners-constants';
import type { RawPractitioner } from '@shared/business/entities/Practitioner';

requireEnvVars(['ENV', 'REGION']);
const stats: boolean = !!(process.argv[2] && process.argv[2] === '--stats');

type tCase = {
  caseCaption: string;
  closedDate: string;
  closedDateFormatted: string;
  docketEntries?: tDocketEntry[];
  docketNumber: string;
  docketNumberSuffix: string;
  noticeOfTrialDate: string;
  noticeOfTrialDateFormatted: string;
  privatePractitioners: RawPractitioner[];
  receivedAt: string;
  receivedAtFormatted: string;
  status: string;
  trialDate: string;
  trialDateFormatted: string;
  trialSessionId: string;
};
type tDocketEntry = {
  docketNumber: string;
  eventCode: string;
  index: number;
  receivedAt: string;
  receivedAtFormatted: string;
  userId: string;
};
type tUsersCase = {
  caseCaption: string;
  closedByStipulatedDecision: boolean;
  closedDate: string;
  closedDateFormatted: string;
  docketNumber: string;
  docketNumberSuffix: string;
  duration: number;
  hasNoticeOfAppeal: boolean;
  noticeOfTrialDate: string;
  noticeOfTrialDateFormatted: string;
  privatePractitioners: RawPractitioner[];
  receivedAt: string;
  receivedAtFormatted: string;
  status: string;
  trialDate: string;
  trialDateFormatted: string;
  trialSessionId: string;
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
    const userId = hit.pk?.replace('user|', '');
    if (userId) {
      nonAttorneys[userId] = {
        barNumber: hit.barNumber,
        name: hit.name,
        userId,
      };
    }
  }
  return nonAttorneys;
};

const retrieveNonAttorneys = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<{
  [key: string]: tNonAttorney;
}> => {
  const searchParameters = {
    body: {
      _source: ['barNumber.S', 'name.S', 'pk.S'],
      query: {
        bool: {
          must: [
            {
              term: {
                'practitionerType.S': 'Non-Attorney',
              },
            },
          ],
        },
      },
    },
    index: 'efcms-user',
  };

  const { results } = await searchAll({ applicationContext, searchParameters });
  return formatNonAttorneys({ results });
};

// const retrieveNonAttorneysByBarNos = async ({
//   applicationContext,
//   barNos,
// }: {
//   applicationContext: IApplicationContext;
//   barNos: string[];
// }): Promise<{
//   [key: string]: { barNumber: string; name: string; userId: string };
// }> => {
//   const searchParameters = {
//     body: {
//       _source: ['barNumber.S', 'name.S', 'pk.S'],
//       from: 0,
//       query: {
//         bool: {
//           must: [
//             {
//               terms: {
//                 'barNumber.S': barNos,
//               },
//             },
//           ],
//         },
//       },
//       size: 10000,
//     },
//     index: 'efcms-user',
//   };
//
//   const { results } = await search({ applicationContext, searchParameters });
//   return formatNonAttorneys({ results });
// };

const retrieveCases = async ({
  applicationContext,
  userIds,
}: {
  applicationContext: IApplicationContext;
  userIds: string[];
}): Promise<tCase[]> => {
  const searchParameters = {
    body: {
      _source: [
        'caseCaption.S',
        'closedDate.S',
        'docketNumber.S',
        'docketNumberSuffix.S',
        'noticeOfTrialDate.S',
        'privatePractitioners.L.M.userId.S',
        'receivedAt.S',
        'status.S',
        'trialDate.S',
        'trialSessionId.S',
      ],
      query: {
        bool: {
          must: [
            {
              terms: {
                'privatePractitioners.L.M.userId.S': userIds,
              },
            },
          ],
        },
      },
    },
    index: 'efcms-case',
  };
  const { results } = await searchAll({ applicationContext, searchParameters });
  return results.map((hit: RawCase) => {
    return {
      ...pick(hit, [
        'caseCaption',
        'closedDate',
        'docketNumber',
        'docketNumberSuffix',
        'noticeOfTrialDate',
        'privatePractitioners',
        'receivedAt',
        'status',
        'trialDate',
        'trialSessionId',
      ]),
      closedDateFormatted: hit.closedDate
        ? formatDateString(hit.closedDate, 'MMDDYYYY')
        : '',
      noticeOfTrialDateFormatted: hit.noticeOfTrialDate
        ? formatDateString(hit.noticeOfTrialDate, 'MMDDYYYY')
        : '',
      receivedAtFormatted: hit.receivedAt
        ? formatDateString(hit.receivedAt, 'MMDDYYYY')
        : '',
      trialDateFormatted: hit.trialDate
        ? formatDateString(hit.trialDate, 'MMDDYYYY')
        : '',
    };
  });
};

const retrieveDocketEntries = async ({
  applicationContext,
  docketNumbers,
}: {
  applicationContext: IApplicationContext;
  docketNumbers: string[];
}): Promise<tDocketEntry[]> => {
  const searchParameters = {
    body: {
      _source: [
        'docketNumber.S',
        'eventCode.S',
        'index.N',
        'receivedAt.S',
        'userId.S',
      ],
      query: {
        bool: {
          must: [
            {
              terms: {
                'docketNumber.S': docketNumbers,
              },
            },
          ],
        },
      },
    },
    index: 'efcms-docket-entry',
  };
  const { results } = await searchAll({ applicationContext, searchParameters });
  return results.map((hit: RawDocketEntry) => {
    return {
      ...pick(hit, [
        'docketNumber',
        'eventCode',
        'index',
        'receivedAt',
        'userId',
      ]),
      receivedAtFormatted: hit.receivedAt
        ? formatDateString(hit.receivedAt, 'MMDDYYYY')
        : '',
    };
  });
};

const getUsersCases = ({
  cases,
  docketEntries,
  userId,
}: {
  cases: tCase[];
  docketEntries: tDocketEntry[];
  userId: string;
}): tUsersCase[] => {
  const usersCases: tUsersCase[] = [];
  const casesFiltered = cases.filter(c => {
    const privatePractitionerIds = c.privatePractitioners.map(pp => pp.userId);
    return privatePractitionerIds.includes(userId);
  });
  for (const caseRecord of casesFiltered) {
    caseRecord.docketEntries = docketEntries.filter(de => {
      return de.docketNumber === caseRecord.docketNumber;
    });
    usersCases.push({
      ...caseRecord,
      closedByStipulatedDecision: closedByStipulatedDecision(caseRecord),
      duration: calculateCaseDuration(caseRecord),
      hasNoticeOfAppeal: hasNoticeOfAppeal(caseRecord),
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
  let initialClosureDate = determineInitialClosureDate(caseRecord);
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
  return firstDecisionDocReceivedDate || caseRecord.closedDate;
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
    '"Bar Number","Name","Docket Number","Case Type","Case Caption","Case Status","Documents Filed",' +
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
      `"${usersCase.docketNumberSuffix || ''}","${usersCase.caseCaption}","${usersCase.status}",` +
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
  const applicationContext = createApplicationContext({});
  const nonAttorneys = await retrieveNonAttorneys({ applicationContext });
  const cases = await retrieveCases({
    applicationContext,
    userIds: Object.keys(nonAttorneys),
  });
  const docketEntries = await retrieveDocketEntries({
    applicationContext,
    docketNumbers: cases.map(c => c.docketNumber),
  });
  if (stats) {
    outputStatsHeader();
  } else {
    outputHeader();
  }
  for (const userId of Object.keys(nonAttorneys)) {
    const usersCases = getUsersCases({ cases, docketEntries, userId });
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
