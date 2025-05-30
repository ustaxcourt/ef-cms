import { get } from '../../dynamodbClientService';
import { query } from '../../dynamodbClientService';

export const getDocketEntryOnCase = ({
  applicationContext,
  docketEntryId = '',
  docketNumber,
}) => {
  if (docketEntryId) {
    return get({
      Key: {
        pk: `case|${docketNumber}`,
        sk: `docket-entry|${docketEntryId}`,
      },
      applicationContext,
    });
  }
  return query({
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
};
