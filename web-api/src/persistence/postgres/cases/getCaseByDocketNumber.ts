import { ConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';
import { NotFoundError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregateCaseItems } from '@web-api/persistence/dynamo/helpers/aggregateCaseItems';
import { getCasesMetadataWithCounselByLeadDocketNumber } from '@web-api/persistence/postgres/cases/getCasesMetadataWithCounselByLeadDocketNumber';
import { getDbReader } from '@web-api/database';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
import { queryFull } from '@web-api/persistence/dynamodbClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { formatSealedAddresses } from '@shared/business/utilities/caseFilter';
import { getCaseMetadataWithCounsel } from '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel';
import { getCaseCorrespondenceByDocketNumber } from '@web-api/persistence/postgres/caseCorrespondences/getCaseCorrespondenceByDocketNumber';

export const getCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
  includeConsolidatedCases = true,
  user = undefined, // Only needed to check permissions on sealed addresses for consolidated cases
}: {
  docketNumber: string;
  applicationContext: ServerApplicationContext;
  includeConsolidatedCases?: boolean;
  user?: UnknownAuthUser;
}): Promise<RawCase> => {
  // These case items are no longer in dynamoDB
  const SK_FILTER_OUT = ['work-item', 'correspondence', 'case'];

  const dbCaseMetadata = await getCaseMetadataWithCounsel({
    applicationContext,
    docketNumber,
  });
  if (!dbCaseMetadata) {
    throw new NotFoundError(`Case ${docketNumber} not found`);
  }

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
      .selectFrom('dwCaseStatistic as cs')
      .where('docketNumber', '=', docketNumber)
      .leftJoin('dwStatisticPenalty as sp', 'sp.statisticId', 'cs.statisticId')
      .selectAll()
      .select('cs.statisticId')
      .execute(),
  );

  const dbCaseCorrespondences = await getCaseCorrespondenceByDocketNumber({
    docketNumber,
  });

  // Group penalties by statisticId
  const statisticsWithPenalties = dbCaseStatistics.reduce((acc, row) => {
    const {
      determinationDeficiencyAmount,
      determinationTotalPenalties,
      irsDeficiencyAmount,
      irsTotalPenalties,
      lastDateOfPeriod,
      statisticId,
      year,
      yearOrPeriod,
      ...penaltyData
    } = row;
    if (!acc[statisticId]) {
      acc[statisticId] = {
        determinationDeficiencyAmount,
        determinationTotalPenalties,
        irsDeficiencyAmount,
        irsTotalPenalties,
        lastDateOfPeriod,
        penalties: [],
        statisticId,
        year,
        yearOrPeriod,
      };
    }
    if (penaltyData.penaltyId) {
      acc[statisticId].penalties.push(penaltyData);
    }
    return acc;
  }, {});

  const workItems = await getWorkItemsByDocketNumber({
    docketNumber,
  });

  const caseItems = await queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  }).then(items =>
    items.filter(
      item => !SK_FILTER_OUT.some(prefix => item.sk.startsWith(prefix)),
    ),
  );

  let consolidatedCases: RawCase[] = [];
  if (includeConsolidatedCases) {
    consolidatedCases = await getCasesMetadataWithCounselByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: dbCaseMetadata.leadDocketNumber!,
    });
    if (user) {
      consolidatedCases = consolidatedCases.map(c =>
        formatSealedAddresses(c, user),
      );
    }
  }

  return purgeDynamoKeys({
    ...aggregateCaseItems([
      ...caseItems,
      {
        ...dbCaseMetadata,
        caseStatusHistory,
        hearings: dbCaseMetadata.hearings || [],
        pk: `case|${dbCaseMetadata.docketNumber}`,
        sk: `case|${dbCaseMetadata.docketNumber}`,
        statistics: Object.values(statisticsWithPenalties),
      },
      ...dbCaseCorrespondences.map(correspondenceItem => ({
        ...correspondenceItem,
        pk: `case|${docketNumber}`,
        sk: `correspondence|${correspondenceItem.correspondenceId}`,
      })),
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
