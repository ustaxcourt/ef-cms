const AWS = require('aws-sdk');
const { EnvironmentCredentials } = AWS;
const { describeElasticsearchDomainConfig } = AWS.ES;
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const {
  ELASTICSEARCH_API_VERSION,
} = require('../elasticsearch/elasticsearch-settings');
// const mappings = require('../elasticsearch/elasticsearch-mappings');
// const migratedCase = require('./migratedCase.json');
// const { settings } = require('../elasticsearch/elasticsearch-settings');

const getHost = async (environmentName, version) => {
  const DomainName = `efcms-${environmentName}-${version}-search`;
  console.log(`getHost for ${DomainName}`);
  const { Endpoint } = await describeElasticsearchDomainConfig({
    DomainName,
  });
  console.log(Endpoint);
  return Endpoint;
};

const getClient = host => {
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

module.exports = { getClient, getHost };
