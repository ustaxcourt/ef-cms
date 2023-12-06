import {
  CaseRecord,
  IrsPractitionerOnCaseRecord,
  PrivatePractitionerOnCaseRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';
import { isCaseItem } from '@web-api/persistence/dynamo/helpers/aggregateCaseItems';
import { queryFull } from '../../dynamodbClientService';

export const getCasesMetadataByLeadDocketNumber = async ({
  applicationContext,
  leadDocketNumber,
}: {
  applicationContext: IApplicationContext;
  leadDocketNumber: string;
}) => {
  const consolidatedGroup = await queryFull<
    IrsPractitionerOnCaseRecord | PrivatePractitionerOnCaseRecord | CaseRecord
  >({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `leadCase|${leadDocketNumber}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  return await Promise.all(
    consolidatedGroup.filter(isCaseItem).map(({ docketNumber }) =>
      applicationContext.getPersistenceGateway().getCaseMetadataWithCounsel({
        applicationContext,
        docketNumber,
      }),
    ),
  );
};
