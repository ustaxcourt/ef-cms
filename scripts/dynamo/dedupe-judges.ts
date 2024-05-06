import { GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { createApplicationContext } from '@web-api/applicationContext';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const getJudge = async ({ applicationContext, dynamoClient, judgeId }) => {
  console.log(judgeId);
  const item = await dynamoClient.send(
    new GetItemCommand({
      Key: {
        pk: { S: judgeId },
        sk: { S: judgeId },
      },
      TableName: process.env.DYNAMODB_TABLE_NAME,
    }),
  );

  const judge = unmarshall(item.Item);
  if (judge.role === 'judge') {
    try {
      // lookup in cognito
      const cognitoRecord = await applicationContext
        .getUserGateway()
        .getUserByEmail({ email: judge.email });
      console.log('cognitoRecord', cognitoRecord);
    } catch (err) {
      console.log('newp', { err, judge });
    }
    console.log(item);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});

  const dynamoClient = applicationContext.getDynamoClient(applicationContext, {
    useMainRegion: false,
  });

  // get judges by section|judge

  const tableName: string = process.env.DYNAMODB_TABLE_NAME!;
  const command = new QueryCommand({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': {
        S: 'section|judge',
      },
    },
    KeyConditionExpression: '#pk = :pk',
    TableName: tableName,
  });

  const response = await dynamoClient.send(command);

  for (const item of response.Items) {
    await getJudge({ applicationContext, dynamoClient, judgeId: item.sk.S });
  }

  // for each judge, get judge by user|<id>

  // check that they're in cognito
})();
