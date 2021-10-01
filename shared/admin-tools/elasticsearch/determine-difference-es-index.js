/**
 * Get all of the ES records from an index on a given environment, alpha and beta.
 *
 * Then compare one with the other to see which records are missing
 */

const { getClient } = require('../../../web-api/elasticsearch/client');

if (process.argv.length < 5) {
  console.log(`
  Determine the delta between alpha and beta Elasticsearch clusters for a given environment and index
  
  Usage: 

    $ node determine-difference-es-index.js <ENVIRONMENT> <SOURCE> <INDEX>

  Example: 

    $ node determine-difference-es-index.js mig alpha efcms-user
`);
  process.exit(1);
}

const environmentName = process.argv[2]; // Example: 'stg'
const sourceVersion = process.argv[3]; // Example: 'alpha'
const indexName = process.argv[4]; // Example: 'efcms-user-case'
const separator = '___';
const lookup = {};

const getAllRecords = async ({ destinationVersion, version }) => {
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
      if (version === destinationVersion) {
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
  // Build object of records
  const records = {
    alpha: [],
    beta: [],
  };

  const destinationVersion = sourceVersion === 'alpha' ? 'beta' : 'alpha';

  for (const version of ['alpha', 'beta']) {
    records[version] = await getAllRecords({ destinationVersion, version });
  }
  console.log(`alpha: ${records.alpha.length} | beta: ${records.beta.length}`);
  // let count = 0;

  console.log(
    `The following records are on '${sourceVersion}', but not on '${destinationVersion}'`,
  );

  for (const rec of records[sourceVersion]) {
    if (!lookup[rec]) {
      console.log(rec.split(separator));
    }
    // count++; // show progress
    // if (count % 10000 === 0) {
    //   console.log(`==== ${count}`);
    // }
  }
})();
