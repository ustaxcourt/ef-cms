const crypto = require('crypto');
const https = require('https');
const { DateTime } = require('luxon');

const EXPIRATION = 90; // days

exports.handler = async context => {
  // TODO: determine all indices older than the expiration that have no finished or pending snapshot
  //  and generate snapshots for each day

  // generate a snapshot of the indices from EXPIRATION days ago
  const backupIndexName = exports.getIndexNameForDaysAgo(EXPIRATION);
  const { sResponseBody, sStatusCode } = await snapshotForIndexName(
    backupIndexName,
  );

  // TODO: determine all indices older than (expiration + 1) and delete them all (if snapshots exist)

  // delete the indices from (EXPIRATION + 1) days ago if a snapshot exists
  const deleteIndexName = exports.getIndexNameForDaysAgo(EXPIRATION + 1);
  const { dResponseBody, dStatusCode } = await deleteIndices(deleteIndexName);

  const responses = {
    createSnapshot: {
      indexName: backupIndexName,
      responseBody: JSON.parse(sResponseBody),
      statusCode: sStatusCode,
    },
    deleteIndices: {
      indexName: deleteIndexName,
      responseBody: JSON.parse(dResponseBody),
      statusCode: dStatusCode,
    },
  };
  if (sStatusCode >= 300 || dStatusCode >= 300) {
    context.fail(JSON.stringify(responses));
  } else {
    context.success(JSON.stringify(responses));
  }
};

/**
 * Determines the Elasticsearch indexName for the date of log expiration
 *
 * @returns {string} Elasticsearch indexName
 */
exports.getIndexNameForDaysAgo = function (expiration) {
  const expirationDay = DateTime.local().plus({ days: -expiration });

  // the indexName is the date formatted as cwl-YYYY.MM.DD
  return 'cwl-' + expirationDay.toFormat('yyyy.MM.dd');
};

/**
 * Ask Elasticsearch to generate a snapshot for the provided indexName
 *
 * @returns {Promise<Object>} information about the response
 */
async function snapshotForIndexName(indexName) {
  const payload = {
    ignore_unavailable: true,
    include_global_state: true,
    indices: indexName,
    metadata: {
      taken_because: 'Backup old indices before cleaning up',
      taken_by: 'DAWSON Automated Backups',
    },
  };

  return await req('PUT', '/_snapshot/archived-logs/' + indexName, payload);
}

/**
 * Determines if a snapshot exists for the provided indexName
 *
 * @returns {Promise<boolean>} snapshot exists?
 */
// eslint-disable-next-line require-await
async function snapshotExists(indexName) {
  return new Promise(resolve => {
    req('GET', '/_snapshot/archived-logs/' + indexName, null).then(response => {
      let exists = false;
      const result = JSON.parse(response.responseBody);
      if ('snapshots' in result) {
        const completedSnapshots = result.snapshots.filter(snapshot => {
          return (
            snapshot.snapshot === indexName && snapshot.state === 'SUCCESS'
          );
        });
        if (completedSnapshots.length) {
          exists = true;
        }
      }
      resolve(exists);
    });
  });
}

/**
 * Ask Elasticsearch to delete entries with the provided indexName
 *
 * @returns {Promise<Object>} information about the response
 */
async function deleteIndices(indexName) {
  const shouldDelete = await snapshotExists(indexName);
  if (!shouldDelete) {
    return new Promise(resolve => {
      resolve({
        responseBody: 'Snapshot does not exist for ' + indexName,
        statusCode: 404,
      });
    });
  }

  return await req('DELETE', '/' + indexName, null);
}

/**
 * Sends a request to Elasticsearch
 *
 * @returns {Promise<Object>} information about the response
 */
// eslint-disable-next-line require-await
async function req(verb, path, body) {
  return new Promise(resolve => {
    const requestParams = buildRequest(
      process.env.es_endpoint,
      verb,
      path,
      body,
    );

    const request = https.request(requestParams, response => {
      let responseBody = '';
      response.on('data', chunk => (responseBody += chunk));

      response.on('end', () => {
        const { statusCode } = response;

        const requestInfo = {
          endpoint: process.env.es_endpoint,
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
        resolve({
          responseBody: JSON.parse(responseBody),
          statusCode,
        });
      });
    });

    request.end(requestParams.body);
  });
}

/**
 * Builds request parameters for a bulk upload to Elasticsearch.
 *
 * @returns {Object} The request parameters.
 */
function buildRequest(endpoint, verb, path, body) {
  let endpointParts = endpoint.match(
    /^([^.]+)\.?([^.]*)\.?([^.]*)\.amazonaws\.com$/,
  );
  let region = endpointParts[2];
  let service = endpointParts[3];
  let datetime = DateTime.local()
    .toISO()
    .replace(/[:-]|\.\d{3}/g, '');
  let date = DateTime.local().toFormat('yyyyMMdd');
  let kDate = hmac('AWS4' + process.env.AWS_SECRET_ACCESS_KEY, date);
  let kRegion = hmac(kDate, region);
  let kService = hmac(kRegion, service);
  let kSigning = hmac(kService, 'aws4_request');

  let request = {
    body,
    headers: {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'application/json',
      Host: endpoint,
      'X-Amz-Date': datetime,
      'X-Amz-Security-Token': process.env.AWS_SESSION_TOKEN,
    },
    host: endpoint,
    method: verb,
    path,
  };

  let canonicalHeaders = Object.keys(request.headers)
    .sort(function (a, b) {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    })
    .map(function (k) {
      return k.toLowerCase() + ':' + request.headers[k];
    })
    .join('\n');

  let signedHeaders = Object.keys(request.headers)
    .map(function (k) {
      return k.toLowerCase();
    })
    .sort()
    .join(';');

  let canonicalString = [
    request.method,
    request.path,
    '',
    canonicalHeaders,
    '',
    signedHeaders,
    hash(request.body, 'hex'),
  ].join('\n');

  let credentialString = [date, region, service, 'aws4_request'].join('/');

  let stringToSign = [
    'AWS4-HMAC-SHA256',
    datetime,
    credentialString,
    hash(canonicalString, 'hex'),
  ].join('\n');

  request.headers.Authorization = [
    'AWS4-HMAC-SHA256 Credential=' +
      process.env.AWS_ACCESS_KEY_ID +
      '/' +
      credentialString,
    'SignedHeaders=' + signedHeaders,
    'Signature=' + hmac(kSigning, stringToSign, 'hex'),
  ].join(', ');

  return request;
}

/**
 * Creates a SHA256 HMAC digest of a string.
 *
 * @returns {string} The calculated digest
 */
function hmac(key, str, encoding) {
  return crypto.createHmac('sha256', key).update(str, 'utf8').digest(encoding);
}

/**
 * Creates a SHA256 hash of a string.
 *
 * @returns {string} The calculated hash
 */
function hash(str, encoding) {
  return crypto.createHash('sha256').update(str, 'utf8').digest(encoding);
}
