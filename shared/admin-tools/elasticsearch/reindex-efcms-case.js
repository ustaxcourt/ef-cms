const { DynamoDB } = require('aws-sdk');
const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';
const dynamodb = new DynamoDB({ region: 'us-east-1' });

const getOpenCases = async () => {
  const esClient = await getClient({ environmentName });
  const allCases = [];
  const responseQueue = [];

  const res = await esClient.search({
    _source: ['pk.S'],
    body: {
      query: {
        bool: {
          must_not: {
            term: {
              'status.S': 'Closed',
            },
          },
        },
      },
    },
    index: 'efcms-case',
    scroll: '60s',
    size: 5000,
  });

  responseQueue.push(res);
  while (responseQueue.length) {
    const body = responseQueue.shift();

    // collect the titles from this response
    body.hits.hits.forEach(function (hit) {
      allCases.push(hit['_source'].pk.S);
    });

    // check to see if we have collected all of the quotes
    if (body.hits.total.value === allCases.length) {
      return allCases;
    }

    // get the next response if there are more quotes to fetch
    responseQueue.push(
      await esClient.scroll({
        scroll: '60s',
        scrollId: body['_scroll_id'],
      }),
    );
  }
};

const reindexCase = async pk => {
  const TableName = `efcms-${environmentName}-${version}`;

  await dynamodb
    .updateItem({
      ExpressionAttributeValues: {
        ':val1': { N: '' + Date.now() },
      },
      Key: {
        pk: {
          S: pk,
        },
        sk: {
          S: pk,
        },
      },
      TableName,
      UpdateExpression: 'SET indexedTimestamp = :val1',
    })
    .promise();
};

(async () => {
  const cases = await getOpenCases();
  const total = cases.length;
  let count = 0;
  for (const pk of cases) {
    console.log(`${++count}/${total}: ${pk}`);
    // break;
    await reindexCase(pk);
  }
  // await reindexCase('case|6521-16');
})();
