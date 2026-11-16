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

const omittedFields = [
  'correspondence',
  'docketEntries',
  'hearings',
  'irsPractitioners',
] as const;
type CaseReportOmittedFields =
  (typeof omittedFields)[number] | 'consolidatedCases';
type CaseReportCase = Omit<RawCase, CaseReportOmittedFields>;

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
      .select('de.docketNumber')
      .where('de.eventCode', '=', 'P')
      .where('de.filingDate', '>=', jsBegin)
      .where('de.filingDate', '<', jsEnd)
      .execute(),
  );
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
  const filingMethods: { electronic: number; paper: number } = {
    electronic: 0,
    paper: 0,
  };
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
    if (aCase.isPaper) {
      filingMethods.paper++;
    } else {
      filingMethods.electronic++;
    }
    if (aCase.isSealed) {
      sealed++;
    }
    if (aCase.privatePractitioners && aCase.privatePractitioners.length > 0) {
      representation.represented++;
    } else {
      representation.proSe++;
    }
    for (const key of Object.keys(unsortedValues)) {
      if (key in aCase) {
        const value = String(aCase[key]);
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
    filingMethods,
    filingTypes,
    judges,
    partyTypes,
    paymentStatuses,
    preferredTrialCities,
    procedureTypes,
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
    { header: 'Judge', key: 'judge' },
    { header: 'Party Type', key: 'partyType' },
    { header: 'Payment Status', key: 'petitionPaymentStatus' },
    { header: 'Preferred Trial City', key: 'preferredTrialCity' },
    { header: 'Procedure Type', key: 'procedureType' },
    { header: 'Represented', key: 'represented' },
    { header: 'Sealed', key: 'isSealed' },
    { header: 'Status', key: 'status' },
  ];
  const rows = cases.map(c => {
    const caseCaption = formatCaseCaption(c.caseCaption);
    const dateFiled = formatDateString(
      c.receivedAt,
      FORMATS['MMDDYYYY_DASHED'],
    );
    const filingMethod = c.isPaper ? 'Paper' : 'Electronic';
    const filingType = c.filingType || '';
    const isSealed = c.isSealed ? 'Yes' : 'No';
    const judge = formatJudgeName(c.associatedJudge);
    const represented =
      c.privatePractitioners && c.privatePractitioners.length > 0
        ? 'Represented'
        : 'Pro Se';
    return {
      ...pick(c, [
        'caseType',
        'docketNumber',
        'partyType',
        'petitionPaymentStatus',
        'preferredTrialCity',
        'procedureType',
        'status',
      ]),
      caseCaption,
      dateFiled,
      filingMethod,
      filingType,
      isSealed,
      judge,
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
