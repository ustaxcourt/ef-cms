exports.checkSearchClientMappings = async ({ applicationContext }) => {
  const AWS = require('aws-sdk');
  AWS.config.region = 'us-east-1';

  const { elasticsearchEndpoint } = applicationContext.environment;

  const connectionClass = require('http-aws-es');
  const elasticsearch = require('elasticsearch');

  AWS.config.httpOptions.timeout = 300000;

  const { EnvironmentCredentials } = AWS;

  const environment = {
    elasticsearchEndpoint,
    region: 'us-east-1',
  };

  let searchClientCache;
  if (elasticsearchEndpoint.includes('localhost')) {
    searchClientCache = new elasticsearch.Client({
      host: elasticsearchEndpoint,
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
    Object.keys(object).forEach(k => {
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

  const indexSettings = await searchClientCache.indices.getSettings({
    index: 'efcms',
  });

  const mappingLimit =
    indexSettings.efcms.settings.index.mapping.total_fields.limit;

  const fields = indexMapping.efcms.mappings.properties;

  let totalTypes = 0;
  let fieldText = '';

  for (let field of Object.keys(fields)) {
    const typeMatches = countValues(fields[field], 'type');

    if (typeMatches > 50) {
      fieldText += `${field}: ${typeMatches}, `;
    }
    totalTypes += typeMatches;
  }

  const sendToHoneybadger = msg => {
    const honeybadger = applicationContext.initHoneybadger();

    if (honeybadger) {
      honeybadger.notify(msg);
    } else {
      console.log(msg);
    }
  };

  if (fieldText !== '') {
    sendToHoneybadger(
      `Warning: Search Client creating greater than 50 indexes on the following fields: ${fieldText.substring(
        0,
        fieldText.length - 2,
      )}`,
    );
  }

  const currentPercent = (totalTypes / mappingLimit) * 100;
  if (currentPercent >= 75) {
    sendToHoneybadger(
      `Warning: Search Client Mappings have reached the 75% threshold - currently ${currentPercent}%`,
    );
  } else if (currentPercent >= 50) {
    sendToHoneybadger(
      `Warning: Search Client Mappings have reached the 50% threshold - currently ${currentPercent}%`,
    );
  }
};
