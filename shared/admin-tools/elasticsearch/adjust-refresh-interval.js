const {
  elasticsearchIndexes,
} = require('../../../web-api/elasticsearch/elasticsearch-indexes');
const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

const updateRefreshInterval = async val => {
  const esClient = await getClient({ environmentName, version });
  console.log(elasticsearchIndexes);
  try {
    const resp = await esClient.indices.putSettings({
      body: {
        index: {
          refresh_interval: val,
        },
      },
      index: elasticsearchIndexes,
    });

    return resp;
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  await updateRefreshInterval(null);
})();
