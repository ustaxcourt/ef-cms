// get all of the user-case records from alpha, and see which ones are missing from beta

const { getClient } = require('../../../web-api/elasticsearch/client');
const { getVersion } = require('..//util');

if (process.argv.length < 3) {
  console.log(`
  Determine the delta between alpha and beta Elasticsearch clusters for a given environment and index
  
  Usage: 

    $ node determine-difference-es-index.js <ENVIRONMENT> <INDEX>
`);
  process.exit(1);
}

const environmentName = process.argv[2] || 'prod';
const indexName = process.argv[3] || 'efcms-user-case';
const separator = '___';
const lookup = {};

const getAllRecords = async ({ currentVersion, version }) => {
  const esClient = await getClient({ environmentName, version });

  const allRecords = [];
  const responseQueue = [];

  // start things off by searching, setting a scroll timeout, and pushing
  // our first response into the queue to be processed
  const response = await esClient.search({
    _source: ['pk.S', 'sk.S'],
    body: {
      query: {
        match_all: {},
      },
    },
    index: indexName,
    scroll: '30s',
    size: 5000,
  });

  responseQueue.push(response);

  while (responseQueue.length) {
    const body = responseQueue.shift();
    body.hits.hits.forEach(function (hit) {
      const k = `${hit['_source'].pk.S}${separator}${hit['_source'].sk.S}`;

      // build our lookup object
      if (version === currentVersion) {
        lookup[k] = true;
      }
      allRecords.push(k);
    });

    // check to see if we have collected all of the quotes
    if (body.hits.total.value === allRecords.length) {
      return allRecords;
    }

    // get the next response if there are more quotes to fetch
    responseQueue.push(
      await esClient.scroll({
        scroll: '30s',
        scrollId: body['_scroll_id'],
      }),
    );
  }
};

(async () => {
  const records = {};
  const currentVersion = await getVersion();
  const previousVersion = currentVersion === 'alpha' ? 'beta' : 'alpha';

  for (const version of ['alpha', 'beta']) {
    records[version] = await getAllRecords({ currentVersion, version });
  }
  console.log(`alpha: ${records.alpha.length} | beta: ${records.beta.length}`);
  let count = 0;

  for (const rec of records[previousVersion]) {
    if (!lookup[rec]) {
      console.log(rec.split(separator));
    }
    count++; // show progress
    if (count % 10000 === 0) {
      console.log(`==== ${count}`);
    }
  }
})();
