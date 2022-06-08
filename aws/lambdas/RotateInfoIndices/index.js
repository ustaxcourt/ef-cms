const { DateTime } = require('luxon');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { HttpRequest } = require('@aws-sdk/protocol-http');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const { Sha256 } = require('@aws-crypto/sha256-browser');
const { SignatureV4 } = require('@aws-sdk/signature-v4');

const EXPIRATION = process.env.expiration; // days

exports.handler = async context => {
  const responses = { createSnapshot: [], deleteIndices: [] };
  let anyError = false;

  // determine the indexName for all indices older than the expiration
  const expiredIndices = await exports.getExpiredIndices(EXPIRATION);

  for (const ei of expiredIndices) {
    // check if we've already generated a snapshot for this indexName
    const snapshotExists = await exports.snapshotExists(ei);

    if (snapshotExists) {
      // snapshot exists, ok to delete indices
      const { responseBody, statusCode } = await exports.deleteIndices(ei);
      responses.deleteIndices.push({
        indexName: ei,
        responseBody,
        statusCode,
      });
      if (statusCode >= 300) {
        anyError = true;
      }
    } else {
      // snapshot does not exist, let's create one
      const { responseBody, statusCode } = await exports.snapshotForIndexName(
        ei,
      );
      responses.createSnapshot.push({
        indexName: ei,
        responseBody,
        statusCode,
      });
      if (statusCode >= 300) {
        anyError = true;
      }
    }
  }

  return anyError
    ? context.fail(JSON.stringify(responses))
    : context.success(JSON.stringify(responses));
};

/**
 * Determines the Elasticsearch indexName for the date of log expiration
 *
 * @param {Number} expiration number of days
 * @returns {String} Elasticsearch index name
 */
exports.getIndexNameForDaysAgo = expiration => {
  const expirationDay = DateTime.local().plus({ days: -expiration });

  // the indexName is the date formatted as cwl-YYYY.MM.DD
  return `cwl-${expirationDay.toFormat('yyyy.MM.dd')}`;
};

/**
 * Determines the indexName for all indices older than the date of expiration
 *
 * @param {Number} expiration number of days
 * @returns {Promise<Array<String>>} array of Elasticsearch index names
 */
exports.getExpiredIndices = async expiration => {
  const res = await exports.req('GET', '/_cat/indices', null);
  const allIndices = Array.from(
    res.responseBody.matchAll(/cwl[^\s]+/g),
    m => m[0],
  ).sort();

  const expirationDay = exports.getIndexNameForDaysAgo(expiration);

  // the following assumes the index format will not change in the future
  return allIndices.filter(i => {
    return i <= expirationDay; // alphabetic comparison is sufficient
  });
};

/**
 * Asks Elasticsearch to generate a snapshot for the provided indexName
 *
 * @param {String} indexName Elasticsearch index name
 * @returns {Promise<Object>} information about the response
 */
exports.snapshotForIndexName = async indexName => {
  const snapshotAlreadyExists = await exports.snapshotExists(indexName);
  if (snapshotAlreadyExists) {
    return new Promise(resolve => {
      resolve({
        responseBody: { message: `Snapshot already exists for ${indexName}` },
        statusCode: 412,
      });
    });
  }

  const payload = {
    ignore_unavailable: true,
    include_global_state: true,
    indices: indexName,
    metadata: {
      taken_because: 'Backup old indices before cleaning up',
      taken_by: 'DAWSON Automated Backups',
    },
  };

  return exports.req('PUT', `/_snapshot/archived-logs/${indexName}`, payload);
};

/**
 * Determines if a snapshot exists for the provided indexName
 *
 * @param {String} indexName Elasticsearch index name
 * @returns {Promise<Boolean>} snapshot exists?
 */
exports.snapshotExists = async indexName => {
  const snapshots = await exports.req(
    'GET',
    `/_snapshot/archived-logs/${indexName}`,
    null,
  );
  return new Promise(resolve => {
    let exists = false;
    const result = snapshots.responseBody;
    if ('snapshots' in result) {
      const completedSnapshots = result.snapshots.filter(snapshot => {
        return snapshot.snapshot === indexName && snapshot.state === 'SUCCESS';
      });
      if (completedSnapshots.length) {
        exists = true;
      }
    }
    resolve(exists);
  });
};

/**
 * Asks Elasticsearch to delete entries with the provided indexName
 *
 * @param {String} indexName Elasticsearch index name
 * @returns {Promise<Object>} information about the response
 */
exports.deleteIndices = async indexName => {
  const shouldDelete = await exports.snapshotExists(indexName);
  if (!shouldDelete) {
    return new Promise(resolve => {
      resolve({
        responseBody: { message: `Snapshot does not exist for ${indexName}` },
        statusCode: 404,
      });
    });
  }

  return exports.req('DELETE', `/${indexName}`, null);
};

/**
 * Sends a request to the Elasticsearch API
 *
 * @param {String} verb request method
 * @param {String} path request path
 * @param {Object} body request payload
 * @returns {Promise<Object>} information about the response
 */
exports.req = async (verb, path, body) => {
  const signedRequest = await buildSignedRequest(
    process.env.es_endpoint,
    verb,
    path,
    body,
  );

  const client = new NodeHttpHandler();
  const { response } = await client.handle(signedRequest);
  let responseBody = '';
  return new Promise(
    resolve => {
      response.body.on('data', chunk => {
        responseBody += chunk;
      });
      response.body.on('end', () => {
        const { statusCode } = response;

        const requestInfo = {
          domain: process.env.es_endpoint,
          path,
          payload: body,
          type: verb,
        };
        console.log(`Request: ${JSON.stringify({ requestInfo })}`);
        console.log(`Response: ${JSON.stringify({ statusCode })}`);

        if (statusCode >= 300) {
          console.error(`Failure: ${JSON.stringify(responseBody)}`);
        } else {
          console.log(`Success: ${JSON.stringify(responseBody)}`);
        }
        try {
          responseBody = JSON.parse(responseBody);
        } catch (e) {
          // do nothing
        }
        resolve({
          responseBody,
          statusCode,
        });
      });
    },
    error => {
      console.log(`Error: ${error}`);
    },
  );
};

/**
 * Builds Elasticsearch API request parameters
 *
 * @param {String} domain Elasticsearch endpoint
 * @param {String} verb request method
 * @param {String} path request path
 * @param {Object} body request payload
 * @returns {Object} The request parameters
 */
function buildSignedRequest(domain, verb, path, body) {
  const domainParts = domain.match(
    /^([^.]+)\.?([^.]*)\.?([^.]*)\.amazonaws\.com$/,
  );
  const region = domainParts[2];

  const request = new HttpRequest({
    body: body ? JSON.stringify(body) : null,
    headers: {
      'Content-Type': 'application/json',
      Host: domain,
    },
    hostname: domain,
    method: verb,
    path,
  });

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region,
    service: 'es',
    sha256: Sha256,
  });

  return signer.sign(request);
}
