import { Case } from '@shared/business/entities/cases/Case';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import {
  applicationContext,
  ServerApplicationContext,
} from '@web-api/applicationContext';
import { getDbReader } from '@web-api/database';
import { NotFoundError } from '@web-api/errors/errors';
import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
import { getIrsPractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getIrsPractitionersOnCase';
import { getPrivatePractitionersOnCase } from '@web-api/persistence/dynamo/practitioners/getPrivatePractitionersOnCase';
import { queryFull } from '@web-api/persistence/dynamodbClientService';
import { caseCorrespondenceEntity } from '@web-api/persistence/postgres/caseCorrespondences/mapper';
import { CaseCorrespondenceKysely } from '@web-api/persistence/postgres/caseCorrespondences/schema';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { CaseKysely } from '@web-api/persistence/postgres/cases/schema';
import { difference, isEmpty, partition, sortBy } from 'lodash';

export const ALL_OMITTABLE_CASE_FIELDS = [
  'docketEntries',
  'privatePractitioners',
  'irsPractitioners',
  'correspondence',
  'hearings',
] as const;

export type OmittableCaseFields = (typeof ALL_OMITTABLE_CASE_FIELDS)[number];

/**
 * Returns subsets of case data based on excludeFields. If excludeFields is not passed in,
 * it fetches all case-related data except consolidated cases.
 * @param {string[]} docketNumbers
 * @param {OmittableCaseFields[]} excludeFields - OmittableCaseFields[]
 */
export async function getCasesByDocketNumbers<
  T extends OmittableCaseFields[] = [],
>({
  docketNumbers,
  excludeFields,
}: {
  docketNumbers: string[];
  excludeFields?: T;
}): Promise<Omit<RawCase, 'consolidatedCases' | T[number]>[]> {
  if (isEmpty(docketNumbers)) {
    return [];
  }
  const casesData = await getAllCaseData({ docketNumbers, excludeFields });
  const casesDataSorted = sortCaseFields({ cases: casesData, docketNumbers });
  const rawCases = casesDataSorted.map(c => convertDbCaseToRawCase(c));

  return rawCases as Omit<RawCase, 'consolidatedCases' | T[number]>[];
}

async function getAllCaseData<T extends OmittableCaseFields[]>({
  docketNumbers,
  excludeFields,
}: {
  docketNumbers: string[];
  excludeFields?: T;
}): Promise<EnrichedCaseRow[]> {
  const [
    cases,
    privatePractitioners,
    irsPractitioners,
    docketEntriesFromDb,
    caseCorrespondences,
    hearings,
  ] = await Promise.all([
    getCasesMetadata(docketNumbers),
    (async () => {
      if (!excludeFields?.includes('privatePractitioners')) {
        return await getPrivatePractitioners(docketNumbers, applicationContext);
      } else return [];
    })(),
    (async () => {
      if (!excludeFields?.includes('irsPractitioners')) {
        return await getIrsPractitioners(docketNumbers, applicationContext);
      } else return [];
    })(),
    (async () => {
      if (!excludeFields?.includes('docketEntries')) {
        return getDocketEntries(docketNumbers, applicationContext);
      } else return [];
    })(),
    (async () => {
      if (!excludeFields?.includes('correspondence')) {
        return getCaseCorrespondenceByDocketNumber(docketNumbers);
      } else return [];
    })(),
    (async () => {
      if (!excludeFields?.includes('hearings')) {
        return getHearings(docketNumbers);
      } else return [];
    })(),
  ]);

  const notFoundCases = difference(
    docketNumbers,
    cases.map(c => c.docketNumber),
  );
  if (!isEmpty(notFoundCases)) {
    throw new NotFoundError(`Cases ${notFoundCases.join(', ')} not found`);
  }

  const caseMap: Map<string, EnrichedCaseRow> = new Map();
  cases.forEach(c => {
    caseMap.set(c.docketNumber, {
      ...c,
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: c.docketNumber,
        docketNumberSuffix: c.docketNumberSuffix,
      }),
      docketEntries: [],
      archivedDocketEntries: [],
      irsPractitioners: [],
      privatePractitioners: [],
      correspondence: [],
      archivedCorrespondences: [],
      hearings: [],
    });
  });
  docketEntriesFromDb.forEach(docketEntryInfo => {
    const caseInfo = caseMap.get(docketEntryInfo.docketNumber)!;
    caseMap.set(docketEntryInfo.docketNumber, {
      ...caseInfo,
      docketEntries: docketEntryInfo.docketEntries,
    });
  });
  privatePractitioners.forEach(info => {
    const caseInfo = caseMap.get(info.docketNumber)!;
    caseMap.set(info.docketNumber, {
      ...caseInfo,
      privatePractitioners: info.privatePractitioners,
    });
  });
  irsPractitioners.forEach(info => {
    const caseInfo = caseMap.get(info.docketNumber)!;
    caseMap.set(info.docketNumber, {
      ...caseInfo,
      irsPractitioners: info.irsPractitioners,
    });
  });
  caseCorrespondences.forEach(correspondence => {
    const caseInfo = caseMap.get(correspondence.docketNumber!)!;
    const correspondences = caseInfo.correspondence ?? [];
    correspondences.push(correspondence);
    caseMap.set(correspondence.docketNumber!, {
      ...caseInfo,
      correspondence: correspondences,
    });
  });
  hearings.forEach(hearingInfo => {
    const caseInfo = caseMap.get(hearingInfo.docketNumber)!;
    caseMap.set(hearingInfo.docketNumber, {
      ...caseInfo,
      hearings: hearingInfo.hearings,
    });
  });

  return Array.from(caseMap.values());
}

function sortCaseFields({
  cases,
  docketNumbers,
}: {
  cases: EnrichedCaseRow[];
  docketNumbers: string[];
}): EnrichedCaseRow[] {
  cases.forEach(c => {
    const [docketEntries, archivedDocketEntries] = partition(
      c.docketEntries,
      docketEntry => !docketEntry.archived,
    );
    c.docketEntries = sortBy(docketEntries, 'createdAt');
    c.archivedDocketEntries = sortBy(archivedDocketEntries, 'createdAt');

    const [correspondence, archivedCorrespondences] = partition(
      c.correspondence,
      correspondenceItem => !correspondenceItem.archived,
    );
    c.correspondence = sortBy(correspondence, 'filingDate');
    c.archivedCorrespondences = sortBy(archivedCorrespondences, 'filingDate');
  });

  // Sort the cases in the original docketNumber order
  const orderObj = {};
  docketNumbers.forEach((num, idx) => {
    orderObj[num] = idx;
  });
  cases.sort((a, b) => {
    return orderObj[a.docketNumber] - orderObj[b.docketNumber];
  });

  return cases;
}

function convertDbCaseToRawCase(
  dbCase: EnrichedCaseRow,
): Omit<RawCase, 'consolidatedCases'> {
  const appCase = {
    ...fromKyselyCase(dbCase),
    correspondence: dbCase.correspondence.map(cc =>
      caseCorrespondenceEntity(cc),
    ),
    archivedCorrespondences: dbCase.archivedCorrespondences?.map(cc =>
      caseCorrespondenceEntity(cc),
    ),
  };

  return purgeDynamoKeys(appCase);
}

async function getCasesMetadata(docketNumbers: string[]) {
  const caseInfo = await getDbReader(db =>
    db
      .selectFrom('dwCase')
      .where('docketNumber', 'in', docketNumbers)
      .selectAll()
      .execute(),
  );
  return caseInfo;
}

async function getIrsPractitioners(
  docketNumbers: string[],
  applicationContext,
): Promise<
  {
    docketNumber: string;
    irsPractitioners: any[];
  }[]
> {
  const practitionerInfo = await Promise.all(
    docketNumbers.map(async docketNumber => {
      const irsPractitioners = await getIrsPractitionersOnCase({
        applicationContext,
        docketNumber,
      });

      return {
        docketNumber,
        irsPractitioners,
      };
    }),
  );

  return practitionerInfo;
}

async function getPrivatePractitioners(
  docketNumbers: string[],
  applicationContext,
): Promise<
  {
    docketNumber: string;
    privatePractitioners: any[];
  }[]
> {
  const practitionerInfo = await Promise.all(
    docketNumbers.map(async docketNumber => {
      const privatePractitioners = await getPrivatePractitionersOnCase({
        docketNumber,
        applicationContext,
      });

      return {
        docketNumber,
        privatePractitioners,
      };
    }),
  );

  return practitionerInfo;
}

async function getDocketEntries(
  docketNumbers: string[],
  applicationContext: ServerApplicationContext,
): Promise<{ docketNumber: string; docketEntries: RawDocketEntry[] }[]> {
  const docketEntryInfo = await Promise.all(
    docketNumbers.map(async docketNumber => {
      const docketEntries = await getDocketEntriesOnCase({
        applicationContext,
        docketNumber,
      });
      return { docketNumber, docketEntries };
    }),
  );
  return docketEntryInfo;
}

async function getDocketEntriesOnCase({
  applicationContext,
  docketNumber,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
}) {
  return await queryFull<RawDocketEntry>({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pkValue': `case|${docketNumber}`,
      ':skPrefix': 'docket-entry|',
    },
    KeyConditionExpression: '#pk = :pkValue AND begins_with(#sk, :skPrefix)',
    applicationContext,
  });
}

async function getCaseCorrespondenceByDocketNumber(docketNumbers: string[]) {
  const correspondence = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseCorrespondence as cc')
      .where('cc.docketNumber', 'in', docketNumbers)
      .selectAll()
      .select('cc.docketNumber')
      .execute(),
  );
  return correspondence;
}

async function getHearings(
  docketNumbers: string[],
): Promise<{ docketNumber: string; hearings: any[] }[]> {
  const hearingsInfo = await Promise.all(
    docketNumbers.map(async docketNumber => {
      const hearings = await queryFull({
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: {
          ':pk': `case|${docketNumber}`,
          ':prefix': 'hearing|',
        },
        KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
        applicationContext,
      });
      return { docketNumber, hearings };
    }),
  );

  return hearingsInfo;
}

type EnrichedCaseRow = CaseKysely & {
  docketNumberWithSuffix: string;
  docketEntries: RawDocketEntry[];
  archivedDocketEntries: RawDocketEntry[];
  irsPractitioners: RawPractitioner[];
  privatePractitioners: RawPractitioner[];
  correspondence: CaseCorrespondenceKysely[];
  archivedCorrespondences: CaseCorrespondenceKysely[];
  hearings: any[];
};
