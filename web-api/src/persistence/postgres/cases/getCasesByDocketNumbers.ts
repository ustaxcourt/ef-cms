import { Case } from '@shared/business/entities/cases/Case';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@web-api/applicationContext';
import { getDbReader } from '@web-api/database';
import { NotFoundError } from '@web-api/errors/errors';
import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
import { queryFull } from '@web-api/persistence/dynamodbClientService';
import { caseCorrespondenceEntity } from '@web-api/persistence/postgres/caseCorrespondences/mapper';
import { CaseCorrespondenceKysely } from '@web-api/persistence/postgres/caseCorrespondences/schema';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { CaseKysely } from '@web-api/persistence/postgres/cases/schema';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { DocketEntryKysely } from '@web-api/persistence/postgres/docketEntries/schema';
import { difference, isEmpty, sortBy } from 'lodash';
import { UserKysely, UserOnCaseKysely } from '../users/schema';
import { rawUser } from '../users/mapper';

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
        return getPrivatePractitioners({ docketNumbers });
      } else return [];
    })(),
    (async () => {
      if (!excludeFields?.includes('irsPractitioners')) {
        return getIrsPractitioners({ docketNumbers });
      } else return [];
    })(),
    (async () => {
      if (!excludeFields?.includes('docketEntries')) {
        return getDocketEntries(docketNumbers);
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
    if (docketEntryInfo.archived) {
      const archivedDocketEntries = caseInfo.archivedDocketEntries ?? [];
      archivedDocketEntries.push(docketEntryInfo);
      caseMap.set(docketEntryInfo.docketNumber, {
        ...caseInfo,
        archivedDocketEntries,
      });
    } else {
      const docketEntries = caseInfo.docketEntries ?? [];
      docketEntries.push(docketEntryInfo);
      caseMap.set(docketEntryInfo.docketNumber, { ...caseInfo, docketEntries });
    }
  });
  privatePractitioners.forEach(privatePractitioner => {
    const caseInfo = caseMap.get(privatePractitioner.docketNumber)!;
    const existingPrivatePractitioners = caseInfo.privatePractitioners ?? [];
    existingPrivatePractitioners.push(privatePractitioner);
    caseMap.set(privatePractitioner.docketNumber, {
      ...caseInfo,
      privatePractitioners: existingPrivatePractitioners,
    });
  });
  irsPractitioners.forEach(irsPractitioner => {
    const caseInfo = caseMap.get(irsPractitioner.docketNumber)!;
    const existingIrsPractitioners = caseInfo.irsPractitioners ?? [];
    existingIrsPractitioners.push(irsPractitioner);
    caseMap.set(irsPractitioner.docketNumber, {
      ...caseInfo,
      irsPractitioners: existingIrsPractitioners,
    });
  });
  caseCorrespondences.forEach(correspondence => {
    const caseInfo = caseMap.get(correspondence.docketNumber!)!;
    if (correspondence.archived) {
      const archivedCorrespondences = caseInfo.archivedCorrespondences ?? [];
      archivedCorrespondences.push(correspondence);
      caseMap.set(correspondence.docketNumber!, {
        ...caseInfo,
        archivedCorrespondences,
      });
    } else {
      const correspondences = caseInfo.correspondence ?? [];
      correspondences.push(correspondence);
      caseMap.set(correspondence.docketNumber!, {
        ...caseInfo,
        correspondence: correspondences,
      });
    }
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
    c.docketEntries = sortBy(c.docketEntries, 'createdAt');
    c.archivedDocketEntries = sortBy(c.archivedDocketEntries, 'createdAt');

    c.correspondence = sortBy(c.correspondence, 'filingDate');
    c.archivedCorrespondences = sortBy(c.archivedCorrespondences, 'filingDate');
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
    irsPractitioners: dbCase.privatePractitioners.map(ip => rawUser(ip)),
    privatePractitioners: dbCase.privatePractitioners.map(pp => rawUser(pp)),
    docketEntries: dbCase.docketEntries.map(d => fromKyselyDocketEntry(d)),
    archivedDocketEntries: dbCase.archivedDocketEntries.map(aD =>
      fromKyselyDocketEntry(aD),
    ),
  };

  return purgeDynamoKeys(appCase);
}

async function getPrivatePractitioners({
  docketNumbers,
}: {
  docketNumbers: string[];
}) {
  const practitionerInfo = await getDbReader(reader => {
    return reader
      .selectFrom('dwUserOnCase as uoc')
      .innerJoin('dwUser as u', 'uoc.userId', 'u.userId')
      .where('uoc.docketNumber', 'in', docketNumbers)
      .where('u.role', '=', ROLES.privatePractitioner)
      .selectAll('uoc')
      .selectAll('u')
      .execute();
  });

  return practitionerInfo;
}

async function getIrsPractitioners({
  docketNumbers,
}: {
  docketNumbers: string[];
}) {
  const practitionerInfo = await getDbReader(reader => {
    return reader
      .selectFrom('dwUserOnCase as uoc')
      .innerJoin('dwUser as u', 'uoc.userId', 'u.userId')
      .where('uoc.docketNumber', 'in', docketNumbers)
      .where('u.role', '=', ROLES.irsPractitioner)
      .selectAll('uoc')
      .selectAll('u')
      .execute();
  });

  return practitionerInfo;
}

async function getDocketEntries(docketNumbers: string[]) {
  const dbDocketEntries = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .where('docketNumber', 'in', docketNumbers)
      .selectAll()
      .execute(),
  );

  return dbDocketEntries;
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

export async function getDocketEntriesOnCases(
  docketNumbers: string[],
): Promise<DocketEntryKysely[]> {
  return getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry')
      .where('docketNumber', 'in', docketNumbers)
      .selectAll()
      .execute(),
  );
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
  docketEntries: DocketEntryKysely[];
  archivedDocketEntries: DocketEntryKysely[];
  irsPractitioners: (UserKysely & UserOnCaseKysely)[];
  privatePractitioners: (UserKysely & UserOnCaseKysely)[];
  correspondence: CaseCorrespondenceKysely[];
  archivedCorrespondences: CaseCorrespondenceKysely[];
  hearings: any[];
};
