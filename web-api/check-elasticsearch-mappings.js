(async () => {
  const AWS = require('aws-sdk');
  AWS.config.region = 'us-east-1';

  const connectionClass = require('http-aws-es');
  const elasticsearch = require('elasticsearch');

  AWS.config.httpOptions.timeout = 300000;

  const { EnvironmentCredentials } = AWS;

  const environment = {
    elasticsearchEndpoint: process.env.ELASTICSEARCH_ENDPOINT,
    region: 'us-east-1',
  };

  let searchClientCache;
  if (process.env.ELASTICSEARCH_ENDPOINT.includes('localhost')) {
    searchClientCache = new elasticsearch.Client({
      host: process.env.ELASTICSEARCH_ENDPOINT,
    });
  } else {
    searchClientCache = new elasticsearch.Client({
      amazonES: {
        credentials: new EnvironmentCredentials('AWS'),
        region: environment.region,
      },
      apiVersion: '7.1',
      connectionClass: connectionClass,
      host: {
        host: environment.elasticsearchEndpoint,
        port: 443,
        protocol: 'https',
      },
      log: 'warning',
    });
  }

  /**
   * recursively searches the provided object for the provided key
   * and returns the count of instances of that key
   *
   * @param {object} object the object to search
   * @param {string} key the key to search for
   * @returns {number} the total number of key matches
   */
  function countValues(object, key) {
    let count = 0;
    Object.keys(object).some(function (k) {
      if (k === key) {
        count++;
      }
      if (object[k] && typeof object[k] === 'object') {
        const countToAdd = countValues(object[k], key);
        count = count + countToAdd;
      }
    });
    return count;
  }

  const indexMapping = await searchClientCache.indices.getMapping({
    index: 'efcms',
  });
  const fields = indexMapping.efcms.mappings.properties;

  let totalTypes = 0;
  for (let field of Object.keys(fields)) {
    const typeMatches = countValues(fields[field], 'type');
    if (typeMatches > 50) {
      console.log('Mapping for object higher than 50:', field, typeMatches);
    }
    totalTypes += typeMatches;
  }
  console.log('Total mappings:', totalTypes);
})();
