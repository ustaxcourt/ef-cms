const AWS = require('aws-sdk');
const { EnvironmentCredentials } = AWS;

const es = new AWS.ES({
  region: 'us-east-1',
});
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const {
  ELASTICSEARCH_API_VERSION,
} = require('../elasticsearch/elasticsearch-settings');

const getHost = async DomainName => {
  try {
    const result = await es
      .describeElasticsearchDomain({
        DomainName,
      })
      .promise();

    return result.DomainStatus.Endpoint;
  } catch (err) {
    // console.log(err);
    console.log(`could not find resource for ${DomainName}`);
    // if we care about it, throw it...
  }
};

const cache = {
  hosts: {},
};

/**
 * This gets a client that can query
 *
 * @param {Object} providers providers
 * @param {String} providers.environmentName The name of the environment
 * @param {String} providers.version The name of the currently deployed stack (alpha or beta)
 * @returns {Client} An instance of an Elasticsearch Client
 */
const getClient = async ({ environmentName, version }) => {
  const domainName = `efcms-search-${environmentName}-${version}`;
  const host = cache.hosts[domainName] || (await getHost(domainName));

  return new elasticsearch.Client({
    amazonES: {
      credentials: new EnvironmentCredentials('AWS'),
      region: 'us-east-1',
    },
    apiVersion: ELASTICSEARCH_API_VERSION,
    awsConfig: new AWS.Config({ region: 'us-east-1' }),
    connectionClass: connectionClass,
    host,
    log: 'warning',
    port: 443,
    protocol: 'https',
  });
};

/**
 * get the domains on the account.
 *
 * @returns {Array} an array of domain names on the account
 */
const listDomains = async () => {
  const res = await es.listDomainNames().promise();
  return res;
};

module.exports = { getClient, getHost, listDomains };
