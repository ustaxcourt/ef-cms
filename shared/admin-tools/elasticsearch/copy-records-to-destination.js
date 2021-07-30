/**
 *  we are going to rely on ES to figure out what is missing from our destination cluster
 *
 *  for each index,
 *   - get all of the items (their indexes? pk sk?)
 *   - check if they exist in destination
 *   - if not, update the timestamp of the record to prompt re-indexing
 *
 * - check the index count for alpha and beta
 */
// const elasticsearchMappings = require('../../../web-api/elasticsearch/elasticsearch-mappings');
// const promiseRetry = require('promise-retry');
const { chunk } = require('lodash');
const { DynamoDB } = require('aws-sdk');
const { getClient } = require('../../..//web-api/elasticsearch/client');

const dataSource = process.argv[2]; // test-alpha
const dataTarget = process.argv[3]; // mig-beta
const index = process.argv[4]; // alpha or beta
const CHUNK_SIZE = 2000;

const performAction = true;

// const Tables = {
//   destination: `efcms-${environmentName}-${targetVersion}`,
//   source: `efcms-${environmentName}-${dataSource}`,
// };

const dynamodb = new DynamoDB({ region: 'us-east-1' });

const getAllItems = async ({ source }) => {
  const [environmentName, version] = source.split('-');
  const esClient = await getClient({ environmentName, version });
  const allItems = [];
  const responseQueue = [];

  const res = await esClient.search({
    _source: ['pk.S', 'sk.S'],
    body: {
      query: {
        match_all: {},
      },
    },
    index,
    scroll: '60s',
    size: 5000,
  });

  responseQueue.push(res);
  while (responseQueue.length) {
    const body = responseQueue.shift();

    // collect the titles from this response
    body.hits.hits.forEach(function (hit) {
      allItems.push(hit['_source']);
    });

    // check to see if we have collected all of the quotes
    if (body.hits.total.value === allItems.length) {
      return allItems;
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

const reindexItem = async ({ pk, sk }) => {
  try {
    if (!performAction) {
      return;
    }
    await dynamodb
      .updateItem({
        ExpressionAttributeValues: {
          ':val1': { N: '' + Date.now() },
        },
        Key: {
          pk,
          sk,
        },
        TableName: Tables.destination,
        UpdateExpression: 'SET indexedTimestamp = :val1',
      })
      .promise();
  } catch (err) {
    console.log(err);
    // if error is doesn't exist, then check source table!

    // if error is throttle, retry in a sec
    throw err;
  }
};

const getAndMapAllItems = async params => {
  const items = await getAllItems(params);

  console.log(`Found a total of ${items.length} items in the destination`);

  const result = {};
  for (const item of items) {
    result[item.pk.S] = result[item.pk.S] || [];
    result[item.pk.S].push(item.pk.S);
  }
  return result;
};

const checkExists = async ({ item: { pk, sk }, TableName }) => {
  // what are we doing
  const res = await dynamodb
    .getItem({
      Key: {
        pk: {
          S: pk,
        },
        sk: {
          S: sk,
        },
      },
      TableName,
    })
    .promise();
  console.log(!!res.Item);
  return !!res.Item;
};

const getItemsToReindex = async () => {
  const sourceItems = await getAllItems({ source: dataSource });
  console.log(`Found a total of ${sourceItems.length} items in the source`);
  const targetItems = await getAndMapAllItems({
    source: dataTarget,
  });

  return sourceItems.filter(item => {
    return (
      !targetItems[item.pk.S] || !targetItems[item.pk.S].includes(item.sk.S)
    );
  });
};

const reindexIndex = async () => {
  const reindexItems = await getItemsToReindex();

  console.log(
    `Found ${reindexItems.length} total items to re-index in ${index}`,
  );

  // return;
  let count = 0;
  const chunks = chunk(reindexItems, CHUNK_SIZE);
  for (const c of chunks) {
    await Promise.all(c.map(item => reindexItem(item)));
    console.log(`${++count} of ${chunks.length}`);
  }
  // for (const item of reindexItems) {
  //   await ;
  // }
};

(async () => {
  // const currentColor = 'green'; // gets a row from DynamoDB

  // const domains = await listDomains();
  // console.log(domains);

  // first we get the source

  // await reindexIndex();
  const res = await getItemsToReindex();

  console.log(JSON.stringify(res));
  // for (const index of Object.keys(elasticsearchMappings)) {
  //   console.log(`## attempting re-index ${index}`);
  //   console;
  //   if (
  //     [
  //       'efcms-case-deadline',
  //       'efcms-docket-entry',
  //       'efcms-message',
  //       'efcms-user',
  //     ].indexOf(index) > -1
  //   )
  //     continue;
  //   await reindexIndex({ index });
  // }
})();

// console.log(indexes);
// simply check their differences, each of them between clusters
