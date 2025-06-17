import { Case } from '@shared/business/entities/cases/Case';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { applicationContext } from '@web-api/applicationContext';
import { getDbReader } from '@web-api/database';
import { NotFoundError } from '@web-api/errors/errors';
import { queryFull } from '@web-api/persistence/dynamodbClientService';
import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
import { caseCorrespondenceEntity } from '@web-api/persistence/postgres/caseCorrespondences/mapper';
import { CaseCorrespondenceKysely } from '@web-api/persistence/postgres/caseCorrespondences/schema';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { CaseKysely } from '@web-api/persistence/postgres/cases/schema';
import { getIrsPractitionersOnCase } from '@web-api/persistence/postgres/practitioners/getIrsPractitionersOnCase';
import { getPrivatePractitionersOnCase } from '@web-api/persistence/postgres/practitioners/getPrivatePractitionersOnCase';
import { difference, isEmpty, sortBy } from 'lodash';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { DocketEntryKysely } from '@web-api/persistence/postgres/docketEntries/schema';

export async function getCasesByDocketNumbers({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<Omit<RawCase, 'consolidatedCases'>[]> {
  if (isEmpty(docketNumbers)) {
    return [];
  }
  const casesData = await getAllCaseData({ docketNumbers });
  const casesDataSorted = sortCaseFields({ cases: casesData, docketNumbers });
  const rawCases = casesDataSorted.map(c => convertDbCaseToRawCase(c));
  return rawCases;
}

async function getAllCaseData({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<EnrichedCaseRow[]> {
  const [
    cases,
    practitionerInfo,
    docketEntriesFromDb,
    caseCorrespondences,
    hearings,
  ] = await Promise.all([
    getCasesMetadata(docketNumbers),
    getPractitioners(docketNumbers),
    getDocketEntries(docketNumbers),
    getCaseCorrespondenceByDocketNumber(docketNumbers),
    getHearings(docketNumbers),
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
  practitionerInfo.forEach(info => {
    const caseInfo = caseMap.get(info.docketNumber)!;
    caseMap.set(info.docketNumber, {
      ...caseInfo,
      irsPractitioners: info.irsPractitioners,
      privatePractitioners: info.privatePractitioners,
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
    docketEntries: dbCase.docketEntries.map(d => fromKyselyDocketEntry(d)),
    archivedDocketEntries: dbCase.archivedDocketEntries.map(aD =>
      fromKyselyDocketEntry(aD),
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

async function getPractitioners(docketNumbers: string[]): Promise<
  {
    docketNumber: string;
    irsPractitioners: any[];
    privatePractitioners: any[];
  }[]
> {
  const practitionerInfo = await Promise.all(
    docketNumbers.map(async docketNumber => {
      const privatePractitioners = await getPrivatePractitionersOnCase({
        docketNumber,
      });

      const irsPractitioners = await getIrsPractitionersOnCase({
        docketNumber,
      });

      return {
        docketNumber,
        irsPractitioners,
        privatePractitioners,
      };
    }),
  );

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
  irsPractitioners: RawPractitioner[];
  privatePractitioners: RawPractitioner[];
  correspondence: CaseCorrespondenceKysely[];
  archivedCorrespondences: CaseCorrespondenceKysely[];
  hearings: any[];
};
