import { query } from '../../dynamodbClientService';

exports.getUserCaseMappingsByDocketNumber = ({
  applicationContext,
  docketNumber,
}) =>
  query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `user-case|${docketNumber}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });
