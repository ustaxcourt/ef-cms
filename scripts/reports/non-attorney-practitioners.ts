// usage: npx ts-node --transpile-only scripts/reports/non-attorney-practitioners.ts >> ~/Desktop/non-attorney-practitioners.csv

import {
  calculateDifferenceInDays,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { createApplicationContext } from '@web-api/applicationContext';
import {
  nonAttorneyBarNos,
  substantiveEventCodes,
} from './non-attorney-practitioners-constants';
import { pick, sortBy } from 'lodash';
import { requireEnvVars } from '../../shared/admin-tools/util';
import {
  search,
  searchAll,
} from '@web-api/persistence/elasticsearch/searchClient';
import type { RawPractitioner } from '@shared/business/entities/Practitioner';

requireEnvVars(['ENV', 'REGION']);

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

const retrieveNonAttorneys = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<{
  [key: string]: { barNumber: string; name: string; userId: string };
}> => {
  const searchParameters = {
    body: {
      _source: ['barNumber.S', 'name.S', 'pk.S'],
      from: 0,
      query: {
        bool: {
          must: [
            {
              terms: {
                'barNumber.S': nonAttorneyBarNos,
              },
            },
          ],
        },
      },
      size: 10000,
    },
    index: 'efcms-user',
  };

  const nonAttorneys = {};
  const { results } = await search({ applicationContext, searchParameters });
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
  return (
    (caseRecord.docketEntries &&
      caseRecord.docketEntries.length &&
      caseRecord.docketEntries.filter(de => {
        return eventCodes.includes(de.eventCode);
      }).length > 0) ||
    false
  );
};

const hasDocumentWithEventCodesFiledByUser = (
  caseRecord: tCase,
  eventCodes: string[],
  userId: string,
): boolean => {
  return (
    (caseRecord.docketEntries &&
      caseRecord.docketEntries.length &&
      caseRecord.docketEntries.filter(de => {
        return de.userId === userId && eventCodes.includes(de.eventCode);
      }).length > 0) ||
    false
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
  console.log(
    '"Bar Number","Name","Docket Number","Case Type","Case Caption","Case Status","Documents Filed",' +
      '"Substantive Documents Filed","Filed Pretrial Memorandum","Closed by Stipulated Decision","Went to Trial",' +
      '"Date of Receipt of Petition","Date of Notice of Trial","Date Closed","Total Duration in Days",' +
      '"Trial Date","Has Notice of Appeal"',
  );
  for (const userId of Object.keys(nonAttorneys)) {
    const usersCases = getUsersCases({ cases, docketEntries, userId });
    for (const uc of usersCases) {
      console.log(
        `"${nonAttorneys[userId].barNumber}","${nonAttorneys[userId].name}","${uc.docketNumber}",` +
          `"${uc.docketNumberSuffix || ''}","${uc.caseCaption}","${uc.status}","${uc.usersDocumentsCount}",` +
          `"${uc.usersSubstantiveDocumentsCount}","${uc.userFiledPretrialMemorandum}",` +
          `"${uc.closedByStipulatedDecision}","${uc.wentToTrial}","${uc.receivedAtFormatted}",` +
          `"${uc.noticeOfTrialDateFormatted}","${uc.closedDateFormatted}","${uc.duration}",` +
          `"${uc.trialDateFormatted}","${uc.hasNoticeOfAppeal}"`,
      );
    }
  }
})();
