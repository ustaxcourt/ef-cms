import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregateCaseItems } from '@web-api/persistence/dynamo/helpers/aggregateCaseItems';
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
  const dbCase = await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .executeTakeFirstOrThrow(),
  );

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
      leadDocketNumber: dbCase!.leadDocketNumber!, // 10502 TODO
    });
  }

  return purgeDynamoKeys({
    ...aggregateCaseItems([
      ...caseItems,
      transformNullToUndefined({
        ...dbCase,
        blockedDate: dbCase.blockedDate?.toISOString(),
        caseCaption: dbCase.caption,
        caseStatusHistory,
        closedDate: dbCase.closedDate?.toISOString(),
        createdAt: dbCase.createdAt?.toISOString(),
        hearings: dbCase.hearings || [],
        irsNoticeDate: dbCase.irsNoticeDate?.toISOString(),
        noticeOfTrialDate: dbCase.noticeOfTrialDate?.toISOString(),
        petitionPaymentDate: dbCase.petitionPaymentDate?.toISOString(),
        petitionPaymentWaivedDate:
          dbCase.petitionPaymentWaivedDate?.toISOString(),
        petitioners: petitionersOnCase,
        pk: `case|${dbCase.docketNumber}`,
        receivedAt: dbCase.receivedAt?.toISOString(),
        sealedDate: dbCase.sealedDate?.toISOString(),
        sk: `case|${dbCase.docketNumber}`,
        statistics: dbCaseStatistics,
        trialDate: dbCase.trialDate?.toISOString(),
      }),
      ...workItems.map(workItem => ({
        ...workItem,
        pk: `case|${docketNumber}`,
        sk: `work-item|${workItem.workItemId}`,
      })),
    ]),
    ...consolidatedCases.map(caseRecord => ({
      pk: `case|${caseRecord.docketNumber}`,
      sk: `case|${caseRecord.docketNumber}`,
    })),
  });
};
