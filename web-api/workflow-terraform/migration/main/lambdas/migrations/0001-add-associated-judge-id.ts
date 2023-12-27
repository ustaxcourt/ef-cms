import { TDynamoRecord } from '../../../../../src/persistence/dynamo/dynamoTypes';

const isCaseRecord = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

const isCaseDeadline = item => {
  return (
    item.pk.startsWith('case-deadline|') && item.sk.startsWith('case-deadline|')
  );
};

const isWorkItem = item => {
  return item.gsi1pk?.startsWith('work-item|');
};

const isRecordToUpdate = item => {
  return isCaseRecord(item) || isCaseDeadline(item) || isWorkItem(item);
};

async function getAllJudgeRecords(documentClient) {
  const scanParams = {
    ExpressionAttributeNames: {
      '#n': 'name',
      '#r': 'role',
    },
    ExpressionAttributeValues: {
      ':prefix': 'user|',
      ':role1': 'judge',
      ':role2': 'legacyJudge',
    },
    FilterExpression:
      'begins_with(pk, :prefix) AND begins_with(sk, :prefix) AND (#r = :role1 OR #r = :role2)',
    ProjectionExpression: 'pk, sk, #r, #n, userId',
    TableName: process.env.SOURCE_TABLE!,
  };

  const items: { userId: string; name: string }[] = [];
  let lastEvaluatedKey = null;

  do {
    const params = lastEvaluatedKey
      ? { ...scanParams, ExclusiveStartKey: lastEvaluatedKey }
      : scanParams;

    const result = (await documentClient.scan(params).promise()) as unknown as {
      Items: { userId: string; name: string }[];
      LastEvaluatedKey?: any;
    };

    items.push(...result.Items);
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return items;
}

export const migrateItems = async (
  items: any[],
  documentClient: AWS.DynamoDB.DocumentClient,
) => {
  const itemsAfter: TDynamoRecord[] = [];
  let judgesMap: { [key: string]: string } | null = null;

  for (const item of items) {
    if (
      isRecordToUpdate(item) &&
      item.associatedJudge &&
      item.associatedJudge !== 'Chief Judge'
    ) {
      if (!judgesMap) {
        const judgeRecords = await getAllJudgeRecords(documentClient);

        judgesMap = judgeRecords.reduce(
          (accumulator, judge) => {
            accumulator[judge.name] = judge.userId;
            return accumulator;
          },
          {} as { [key: string]: string },
        );
        item.associatedJudgeId = judgesMap[item.associatedJudge];
      }
    }

    itemsAfter.push(item);
  }

  return itemsAfter;
};
