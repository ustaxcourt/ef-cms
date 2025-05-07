import { ConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';
import { NotFoundError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregateCaseItems } from '@web-api/persistence/dynamo/helpers/aggregateCaseItems';
import { getCasesMetadataWithCounselByLeadDocketNumber } from '@web-api/persistence/postgres/cases/getCasesMetadataWithCounselByLeadDocketNumber';
import { getWorkItemsByDocketNumber } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { purgeDynamoKeys } from '@web-api/persistence/dynamo/helpers/purgeDynamoKeys';
import { queryFull } from '@web-api/persistence/dynamodbClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { formatSealedAddresses } from '@shared/business/utilities/caseFilter';
import { getCaseCorrespondenceByDocketNumber } from '@web-api/persistence/postgres/caseCorrespondences/getCaseCorrespondenceByDocketNumber';
import { getCaseStatistics } from '@web-api/persistence/postgres/cases/statistics/getCaseStatistics';
import { getCaseStatusHistory } from '@web-api/persistence/postgres/cases/getCaseStatusHistory';
import { getCaseMetadataByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';
import { getPractitionersByDocketNumber } from '@web-api/persistence/postgres/practitioners/getPractitionersByDocketNumber';

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

  const dbCaseMetadata = await getCaseMetadataByDocketNumber({
    docketNumber,
  });
  if (!dbCaseMetadata) {
    throw new NotFoundError(`Case ${docketNumber} not found`);
  }

  const [
    caseStatusHistory,
    caseCorrespondences,
    statisticsWithPenalties,
    workItems,
    practitioners,
    caseItemsRaw,
  ] = await Promise.all([
    getCaseStatusHistory({ docketNumber }),
    getCaseCorrespondenceByDocketNumber({
      docketNumber,
    }),
    getCaseStatistics({ docketNumber }),
    getWorkItemsByDocketNumber({
      docketNumber,
    }),
    getPractitionersByDocketNumber({ docketNumber }),
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
  ]);

  const caseItems = caseItemsRaw.filter(
    item => !SK_FILTER_OUT.some(prefix => item.sk.startsWith(prefix)),
  );

  let consolidatedCases: Omit<
    RawCase,
    'consolidatedCases' | 'correspondence' | 'hearings' | 'docketEntries'
  >[] = [];
  if (includeConsolidatedCases) {
    consolidatedCases = await getCasesMetadataWithCounselByLeadDocketNumber({
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
        pk: `case|${dbCaseMetadata.docketNumber}`,
        sk: `case|${dbCaseMetadata.docketNumber}`,
        statistics: Object.values(statisticsWithPenalties),
      },
      ...caseCorrespondences.map(correspondenceItem => ({
        ...correspondenceItem,
        pk: `case|${docketNumber}`,
        sk: `correspondence|${correspondenceItem.correspondenceId}`,
      })),
      ...workItems.map(workItem => ({
        ...workItem,
        pk: `case|${docketNumber}`,
        sk: `work-item|${workItem.workItemId}`,
      })),
      ...practitioners.irsPractitioners.map(irsPractitionerItem => ({
        ...irsPractitionerItem,
        pk: `case|${docketNumber}`,
        sk: `irsPractitioner|${irsPractitionerItem.userId}`,
      })),
      ...practitioners.privatePractitioners.map(privatePractitionerItem => ({
        ...privatePractitionerItem,
        pk: `case|${docketNumber}`,
        sk: `privatePractitioner|${privatePractitionerItem.userId}`,
      })),
    ]),
    consolidatedCases: consolidatedCases.map(
      c => new ConsolidatedCaseSummary(c),
    ),
  });
};
