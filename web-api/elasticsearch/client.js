const AWS = require('aws-sdk');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
const { Client } = require('@opensearch-project/opensearch');
const { getVersion } = require('../../shared/admin-tools/util');

const es = new AWS.ES({
  region: 'us-east-1',
});

const getHost = async DomainName => {
  try {
    const result = await es
      .describeElasticsearchDomain({
        DomainName,
      })
      .promise();
    return result.DomainStatus.Endpoint;
  } catch (err) {
    console.error(`could not find resource for ${DomainName}`, err);
  }
};

/**
 * This gets an Elasticsearch Client to perform search queries
 *
 * @param {Object} providers providers
 * @param {String} providers.environmentName The name of the environment
 * @param {String} providers.version The name of the currently deployed stack (alpha or beta)
 * @returns {elasticsearch.Client} An instance of an Elasticsearch Client
 */

const getClient = async ({ environmentName, version }) => {
  version = version || (await getVersion());
  const domainName = `efcms-search-${environmentName}-${version}`;
  const host = await getHost(domainName);

  return new Client({
    ...AwsSigv4Signer({
      getCredentials: () =>
        new Promise((resolve, reject) => {
          AWS.config.getCredentials((err, credentials) => {
            if (err) {
              reject(err);
            } else {
              resolve(credentials);
            }
          });
        }),

      region: 'us-east-1',
    }),
    node: `https://${host}:443`,
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
