import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamodb = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocument.from(dynamodb, {
  marshallOptions: { removeUndefinedValues: true },
});

const segmentArg = Number(process.argv[2]) || 0;
const totalSegmentsArg = Number(process.argv[3]) || 0;

const scanTableSegment = async (segment: number, totalSegments: number) => {
  let hasMoreResults = true;
  let lastKey: Record<string, any> | undefined;
  let items: Record<string, any>[] = [];
  while (hasMoreResults) {
    hasMoreResults = false;

    const results = await documentClient.scan({
      ExclusiveStartKey: lastKey,
      Segment: segment,
      TableName: process.env.SOURCE_TABLE,
      TotalSegments: totalSegments,
    });
    hasMoreResults = !!results.LastEvaluatedKey;
    lastKey = results.LastEvaluatedKey;
    if (results.Items) {
      items = [...items, ...results.Items];
    }
  }

  return items;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const items = await scanTableSegment(segmentArg, totalSegmentsArg);
  console.log(items.length);
})();
