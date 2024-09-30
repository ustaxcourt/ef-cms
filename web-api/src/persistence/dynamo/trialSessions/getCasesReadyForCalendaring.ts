import { batchGet, query } from '../../dynamodbClientService';

export const getCasesReadyForCalendaring = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}) => {
  const mappings = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': 'eligible-for-trial-case-catalog',
    },
    KeyConditionExpression: '#pk = :pk',
    Limit: 500,
    applicationContext,
  });

  let docketNumbers: string[] = [];
  mappings.map(metadata => {
    const { docketNumber } = metadata;
    if (docketNumbers.includes(docketNumber)) {
      applicationContext.logger.warn(
        `Encountered duplicate eligible-for-trial-case-catalog mapping for case ${docketNumber}.`,
      );
    } else {
      docketNumbers.push(docketNumber);
    }
  });

  return await batchGet({
    applicationContext,
    keys: docketNumbers.map(docketNumber => ({
      pk: `case|${docketNumber}`,
      sk: `case|${docketNumber}`,
    })),
  });
};
