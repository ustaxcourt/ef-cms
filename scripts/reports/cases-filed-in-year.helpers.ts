import { alphabetizeCities, formatCaseCaption } from '../helpers/formatters';
import {
  formatDateString,
  FORMATS,
  getJsDateFromIso,
} from '@shared/business/utilities/DateHandler';
import { formatJudgeName } from '../helpers/formatters';
import { generateCsv } from '../helpers/generate-csv';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { pick } from 'lodash';
import { CONTACT_TYPES } from '@shared/business/entities/EntityConstants';

const omittedFields = [
  'correspondence',
  'docketEntries',
  'hearings',
  'irsPractitioners',
] as const;
type CaseReportOmittedFields =
  (typeof omittedFields)[number] | 'consolidatedCases';
type CaseReportCase = Omit<RawCase, CaseReportOmittedFields>;

const filingDateMap: { [key: string]: string } = {};

export const getDocketNumbersOfPetitionsFiledInTimeframe = async ({
  begin,
  end,
}: {
  begin: string;
  end: string;
}): Promise<string[]> => {
  const jsBegin = getJsDateFromIso(begin);
  const jsEnd = getJsDateFromIso(end);
  const result = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry as de')
      .select(['de.docketNumber', 'de.filingDate'])
      .where('de.eventCode', '=', 'P')
      .where('de.filingDate', '>=', jsBegin)
      .where('de.filingDate', '<', jsEnd)
      .execute(),
  );
  result?.forEach(r => {
    filingDateMap[r.docketNumber] = r.filingDate.toISOString();
  });
  return result?.map(r => r.docketNumber) || [];
};

const getCases = async ({
  begin,
  end,
}: {
  begin: string;
  end: string;
}): Promise<CaseReportCase[]> => {
  const docketNumbers = await getDocketNumbersOfPetitionsFiledInTimeframe({
    begin,
    end,
  });
  const cases = await getCasesByDocketNumbers({
    docketNumbers,
    excludeFields: [...omittedFields],
  });
  cases.sort((a, b) => a.sortableDocketNumber - b.sortableDocketNumber);

  return cases;
};

const outputCaseStats = ({ cases }: { cases: CaseReportCase[] }): void => {
  let consolidatedGroups: number = 0;
  const filingMethods: { electronic: number; paper: number } = {
    electronic: 0,
    paper: 0,
  };
  let hasIntervenor: number = 0;
  let hasParticipant: number = 0;
  let remoteTrialGranted: number = 0;
  let sealed: number = 0;
  const representation: { proSe: number; represented: number } = {
    proSe: 0,
    represented: 0,
  };
  const unsortedValues: { [key: string]: { [key: string]: number } } = {
    associatedJudge: {},
    caseType: {},
    filingType: {},
    partyType: {},
    petitionPaymentStatus: {},
    preferredTrialCity: {},
    procedureType: {},
    status: {},
  };
  for (const aCase of cases) {
    if (
      aCase.leadDocketNumber &&
      aCase.leadDocketNumber === aCase.docketNumber
    ) {
      consolidatedGroups++;
    }
    if (aCase.isPaper) {
      filingMethods.paper++;
    } else {
      filingMethods.electronic++;
    }
    if (aCase.isSealed) {
      sealed++;
    }
    if (aCase.petitioners && aCase.petitioners.length > 0) {
      if (
        aCase.petitioners.some(p => p.contactType === CONTACT_TYPES.intervenor)
      ) {
        hasIntervenor++;
      }
      if (
        aCase.petitioners.some(p => p.contactType === CONTACT_TYPES.participant)
      ) {
        hasParticipant++;
      }
    }
    if (aCase.privatePractitioners && aCase.privatePractitioners.length > 0) {
      representation.represented++;
    } else {
      representation.proSe++;
    }
    if (aCase.remoteTrialGranted) {
      remoteTrialGranted++;
    }
    for (const key of Object.keys(unsortedValues)) {
      if (key in aCase) {
        const value = String(aCase[key] ?? '');
        const counts = unsortedValues[key];
        counts[value] = (counts[value] ?? 0) + 1;
      }
    }
  }

  const caseTypes = {};
  Object.keys(unsortedValues.caseType)
    .sort((a, b) => a.localeCompare(b))
    .forEach(key => {
      caseTypes[key] = unsortedValues.caseType[key];
    });

  const filingTypes = {};
  Object.keys(unsortedValues.filingType)
    .sort((a, b) => {
      if (a === '') return 1;
      if (b === '') return -1;
      return a.localeCompare(b);
    })
    .forEach(key => {
      filingTypes[key] = unsortedValues.filingType[key];
    });

  const judges = {};
  Object.keys(unsortedValues.associatedJudge)
    .sort((a, b) => {
      if (a === '') return 1;
      if (b === '') return -1;
      return a.localeCompare(b);
    })
    .forEach(key => {
      judges[key] = unsortedValues.associatedJudge[key];
    });

  const partyTypes = {};
  Object.keys(unsortedValues.partyType)
    .sort((a, b) => a.localeCompare(b))
    .forEach(key => {
      partyTypes[key] = unsortedValues.partyType[key];
    });

  const paymentStatuses = {};
  Object.keys(unsortedValues.petitionPaymentStatus)
    .sort((a, b) => a.localeCompare(b))
    .forEach(key => {
      paymentStatuses[key] = unsortedValues.petitionPaymentStatus[key];
    });

  const preferredTrialCities = {};
  alphabetizeCities(Object.keys(unsortedValues.preferredTrialCity)).forEach(
    key => {
      preferredTrialCities[key] = unsortedValues.preferredTrialCity[key];
    },
  );

  const procedureTypes = {};
  Object.keys(unsortedValues.procedureType)
    .sort((a, b) => a.localeCompare(b))
    .forEach(key => {
      procedureTypes[key] = unsortedValues.procedureType[key];
    });

  const statuses = {};
  Object.keys(unsortedValues.status)
    .sort((a, b) => a.localeCompare(b))
    .forEach(key => {
      statuses[key] = unsortedValues.status[key];
    });

  console.log({
    caseTypes,
    consolidatedGroups,
    filingMethods,
    filingTypes,
    hasIntervenor,
    hasParticipant,
    judges,
    partyTypes,
    paymentStatuses,
    preferredTrialCities,
    procedureTypes,
    remoteTrialGranted,
    representation,
    sealed,
    statuses,
    total: cases.length,
  });
};

const outputCaseReport = ({
  cases,
  filename,
}: {
  cases: CaseReportCase[];
  filename: string;
}): void => {
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Case Caption', key: 'caseCaption' },
    { header: 'Case Type', key: 'caseType' },
    { header: 'Date Filed', key: 'dateFiled' },
    { header: 'Filing Method', key: 'filingMethod' },
    { header: 'Filing Type', key: 'filingType' },
    { header: 'Has Intervenor', key: 'hasIntervenor' },
    { header: 'Has Participant', key: 'hasParticipant' },
    { header: 'In Consolidated Group', key: 'isInConsolidatedGroup' },
    { header: 'Is Lead Case in Consolidated Group', key: 'isLeadCase' },
    { header: 'Judge', key: 'judge' },
    { header: 'Party Type', key: 'partyType' },
    { header: 'Payment Status', key: 'petitionPaymentStatus' },
    { header: 'Preferred Trial City', key: 'preferredTrialCity' },
    { header: 'Procedure Type', key: 'procedureType' },
    { header: 'Remote Trial Granted', key: 'remoteTrialGranted' },
    { header: 'Represented', key: 'represented' },
    { header: 'Sealed', key: 'isSealed' },
    { header: 'Status', key: 'status' },
  ];
  const rows = cases.map(c => {
    const caseCaption = formatCaseCaption(c.caseCaption);
    const dateFiled = formatDateString(
      filingDateMap[c.docketNumber],
      FORMATS['MMDDYYYY_DASHED'],
    );
    const filingMethod = c.isPaper ? 'Paper' : 'Electronic';
    const filingType = c.filingType || '';
    const hasIntervenor = c.petitioners?.some(
      p => p.contactType === CONTACT_TYPES.intervenor,
    )
      ? 'Yes'
      : 'No';
    const hasParticipant = c.petitioners?.some(
      p => p.contactType === CONTACT_TYPES.participant,
    )
      ? 'Yes'
      : 'No';
    const isInConsolidatedGroup = c.leadDocketNumber ? 'Yes' : 'No';
    const isLeadCase =
      c.leadDocketNumber && c.leadDocketNumber === c.docketNumber
        ? 'Yes'
        : 'No';
    const isSealed = c.isSealed ? 'Yes' : 'No';
    const judge = formatJudgeName(c.associatedJudge);
    const remoteTrialGranted = c.remoteTrialGranted ? 'Yes' : 'No';
    const represented =
      c.privatePractitioners && c.privatePractitioners.length > 0
        ? 'Represented'
        : 'Pro Se';
    return {
      ...pick(c, [
        'caseType',
        'partyType',
        'petitionPaymentStatus',
        'preferredTrialCity',
        'procedureType',
        'status',
      ]),
      caseCaption,
      dateFiled,
      docketNumber: c.docketNumberWithSuffix,
      filingMethod,
      filingType,
      hasIntervenor,
      hasParticipant,
      isInConsolidatedGroup,
      isLeadCase,
      isSealed,
      judge,
      remoteTrialGranted,
      represented,
    };
  });
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
};

export const casesFiledInYear = async ({
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
  const cases = await getCases({ begin, end });
  if (stats) {
    outputCaseStats({ cases });
  } else {
    outputCaseReport({ cases, filename });
  }
};
