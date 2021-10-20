/**
 * this will clear out records from the efcms-user index that don't begin with pk user| sk user|
 * it will also delete the deprecated efcms-user-case index
 */
const { chunk } = require('lodash');
const { getClient } = require('../../../web-api/elasticsearch/client');
const { sleep } = require('../../src/tools/helpers');

const environmentName = process.argv[2] || 'exp1';

const deleteUserCaseIndex = async () => {
  const client = await getClient({ environmentName });

  const res = client.indices.delete({
    index: 'efcms-user-case',
  });
  console.log('user-case index deleted');
  console.log(res);
};

const deleteUserIndexRecords = async ids => {
  const esClient = await getClient({ environmentName });
  const bulk = ids.map(id => {
    return {
      delete: {
        _id: id,
        _index: 'efcms-user',
        _type: '_doc',
      },
    };
  });

  await esClient.bulk({
    body: bulk,
  });
};

const getAllItemsInUserIndex = async () => {
  const esClient = await getClient({ environmentName });
  const allItems = [];
  const responseQueue = [];

  const res = await esClient.search({
    body: {
      query: {
        match_all: {},
      },
    },
    index: 'efcms-user',
    scroll: '60s',
    size: 5000,
  });

  responseQueue.push(res);
  while (responseQueue.length) {
    const body = responseQueue.shift();

    // collect the titles from this response
    body.hits.hits.forEach(function (hit) {
      allItems.push({
        id: hit['_id'],
        pk: hit['_source'].pk.S,
        sk: hit['_source'].sk.S,
      });
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

const cleanUserIndex = async () => {
  const allRecords = await getAllItemsInUserIndex();
  const toRemove = allRecords
    .filter(rec => rec.pk.indexOf('user|') === -1)
    .map(rec => rec.id);

  const chunks = chunk(toRemove, 1000);

  for (const ids of chunks) {
    await deleteUserIndexRecords(ids);
    await sleep(3000);
  }

  console.log(`allRecords: ${allRecords.length}, removed: ${toRemove.length}`);
};

(async () => {
  if (environmentName === 'prod') return;
  await cleanUserIndex();
  await deleteUserCaseIndex();
})();
