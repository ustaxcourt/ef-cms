import {
  UpdateItemCommand,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { createApplicationContext } from '../../../web-api/src/applicationContext';
import { requireEnvVars } from '../util';
import { searchAll } from '../../../web-api/src/persistence/elasticsearch/searchClient';

requireEnvVars(['ENV', 'ELASTICSEARCH_ENDPOINT']);

(async () => {
  // get a client
  const applicationContext = createApplicationContext({});
  const index = 'efcms-case-v2';
  const oldValue =
    'Partnership (as a partnership representative under the BBA regime)';
  const newValue = 'Partnership (as a partnership representative under BBA)';

  // get all docketNumbers
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        _source: ['docketNumber.S'],
        query: {
          term: {
            'partyType.S': oldValue,
          },
        },
      },
      index,
    },
  });

  const client = applicationContext.getDynamoClient(applicationContext, {
    useMainRegion: true,
  });

  const totalCases = results.length;
  console.log(`found ${totalCases} total cases to update`);

  let i = 1;
  for (const row of results) {
    const { docketNumber } = row;
    console.log(`[${i++}/${totalCases}] ${docketNumber}`);

    const commandInput: UpdateItemCommandInput = {
      ExpressionAttributeNames: {
        '#partyType': 'partyType',
      },
      ExpressionAttributeValues: {
        ':partyType': {
          S: newValue,
        },
      },
      Key: {
        pk: {
          S: `case|${docketNumber}`,
        },
        sk: {
          S: `case|${docketNumber}`,
        },
      },
      TableName: applicationContext.environment.dynamoDbTableName,
      UpdateExpression: 'set #partyType = :partyType',
    };

    const command = new UpdateItemCommand(commandInput);
    const resp = await client.send(command);

    console.log(`- ${resp['$metadata'].httpStatusCode}`);
  }
})();
