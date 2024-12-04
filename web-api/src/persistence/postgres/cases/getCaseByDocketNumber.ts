import { ConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';
import { NotFoundError } from '@web-api/errors/errors';
import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregateCaseItems } from '@web-api/persistence/dynamo/helpers/aggregateCaseItems';
import { getCaseMetadataByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';
import { getCasesMetadataWithCounselByLeadDocketNumber } from '@web-api/persistence/postgres/cases/getCasesMetadataWithCounselByLeadDocketNumber';
import { getDbReader } from '@web-api/database';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
import { queryFull } from '@web-api/persistence/dynamodbClientService';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
  includeConsolidatedCases = true,
}: {
  docketNumber: string;
  applicationContext: ServerApplicationContext;
  includeConsolidatedCases?: boolean;
}): Promise<RawCase | undefined> => {
  const dbCaseMetadata = await getCaseMetadataByDocketNumber({ docketNumber });
  if (!dbCaseMetadata) {
    throw new NotFoundError(`Case ${docketNumber} not found`);
  }

  const dbPetitionersOnCase = await getDbReader(reader =>
    reader
      .selectFrom('dwPetitionerOnCase')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .execute(),
  );
  const petitionersOnCase =
    dbPetitionersOnCase.map(x => {
      return new Petitioner(transformNullToUndefined(x))
        .validate()
        .toRawObject();
    }) || [];

  const dbCaseStatusHistory = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseStatusUpdate')
      .where('docketNumber', '=', docketNumber)
      .orderBy('date asc')
      .selectAll()
      .execute(),
  );
  const caseStatusHistory = dbCaseStatusHistory.map(update => {
    return { ...update, date: update.date.toISOString() };
  });

  const dbCaseStatistics = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseStatistic')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .execute(),
  );

  const [caseItems, workItems] = await Promise.all([
    queryFull({
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${docketNumber}`,
      },
      KeyConditionExpression: '#pk = :pk',
      applicationContext,
    }),
    getWorkItemsByDocketNumber({
      docketNumber,
    }),
  ]);

  let consolidatedCases: RawCase[] = [];
  if (includeConsolidatedCases) {
    consolidatedCases = await getCasesMetadataWithCounselByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: dbCaseMetadata!.leadDocketNumber!, // 10502 TODO
    });
  }

  return purgeDynamoKeys({
    ...aggregateCaseItems([
      {
        ...dbCaseMetadata,
        caseStatusHistory,
        hearings: dbCaseMetadata.hearings || [],
        petitioners: petitionersOnCase,
        pk: `case|${dbCaseMetadata.docketNumber}`,
        sk: `case|${dbCaseMetadata.docketNumber}`,
        statistics: dbCaseStatistics,
      },
      ...caseItems,
      ...workItems.map(workItem => ({
        ...workItem,
        pk: `case|${docketNumber}`,
        sk: `work-item|${workItem.workItemId}`,
      })),
    ]),
    consolidatedCases: consolidatedCases.map(
      c => new ConsolidatedCaseSummary(c),
    ),
  });
};
