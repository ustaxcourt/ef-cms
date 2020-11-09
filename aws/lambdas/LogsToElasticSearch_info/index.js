const crypto = require('crypto');
const https = require('https');
const zlib = require('zlib');

// Set this to true if you want to debug why data isn't making it to
// your Elasticsearch cluster. This will enable logging of failed items
// to CloudWatch Logs.
const logFailedResponses = true;

exports.handler = function (input, context) {
  // decode input from base64
  let zippedInput = new Buffer.from(input.awslogs.data, 'base64');

  // decompress the input
  zlib.gunzip(zippedInput, function (error, buffer) {
    if (error) {
      context.fail(error);
      return;
    }

    // parse the input from JSON
    const awslogsData = JSON.parse(buffer.toString('utf8'));

    // transform the input to Elasticsearch documents
    const elasticsearchBulkData = transform(awslogsData);

    // skip control messages
    if (!elasticsearchBulkData) {
      console.log('Received a control message');
      context.succeed('Control message handled successfully');
      return;
    }

    // post documents to the Amazon Elasticsearch Service
    post(elasticsearchBulkData, function (
      error2,
      success,
      statusCode,
      failedItems,
    ) {
      console.log(
        'Response: ' +
          JSON.stringify({
            statusCode: statusCode,
          }),
      );

      if (error2) {
        logFailure(error2, failedItems);
        context.fail(JSON.stringify(error2));
      } else {
        console.log('Success: ' + JSON.stringify(success));
        context.succeed('Success');
      }
    });
  });
};

/**
 * Transform the log input to Elasticsearch documents
 *
 * @returns {string} JSON-encoded string of messages
 */
function transform(payload) {
  if (payload.messageType === 'CONTROL_MESSAGE') {
    return null;
  }

  let bulkRequestBody = '';

  payload.logEvents.forEach(function (logEvent) {
    let timestamp = new Date(1 * logEvent.timestamp);

    // index name format: cwl-YYYY.MM.DD
    let indexName = [
      'cwl-' + timestamp.getUTCFullYear(), // year
      ('0' + (timestamp.getUTCMonth() + 1)).slice(-2), // month
      ('0' + timestamp.getUTCDate()).slice(-2), // day
    ].join('.');

    let source = {};
    source['logdata'] = extractData(logEvent.message, logEvent.extractedFields);
    source['@id'] = logEvent.id;
    source['@timestamp'] = new Date(1 * logEvent.timestamp).toISOString();
    source['@message'] = logEvent.message;
    source['@owner'] = payload.owner;
    source['@log_group'] = payload.logGroup;
    source['@log_stream'] = payload.logStream;

    // Dangling underscores required by Elasticsearch’s bulk insert format
    /* eslint-disable no-underscore-dangle */
    let action = { index: {} };
    action.index._index = indexName;
    action.index._type = 'ef-cms-info';
    action.index._id = logEvent.id;
    /* eslint-enable no-underscore-dangle */

    bulkRequestBody +=
      [JSON.stringify(action), JSON.stringify(source)].join('\n') + '\n';
  });
  return bulkRequestBody;
}

/**
 * Extract log data from an individual log message
 *
 * @returns {Object} the log message extracted to a data object
 */
function extractData(message, extractedFields) {
  if (extractedFields) {
    let data = {};

    for (let key in extractedFields) {
      if (extractedFields.hasOwnProperty(key) && extractedFields[key]) {
        let value = extractedFields[key];

        if (isNumeric(value)) {
          data[key] = 1 * value;
          continue;
        }

        const jsonSubString = extractJson(value);
        if (jsonSubString !== null) {
          data['$' + key] = JSON.parse(jsonSubString);
        }

        data[key] = value;
      }
    }
    return data;
  }

  const jsonSubString = extractJson(message);
  if (jsonSubString !== null) {
    return JSON.parse(jsonSubString);
  }

  return {};
}

/**
 * Return first JSON substring of a message, if it exists.
 *
 * @returns {string} JSON-encoded data
 */
function extractJson(message) {
  let jsonStart = message.indexOf('{');
  if (jsonStart < 0) return null;
  let jsonSubString = message.substring(jsonStart);
  return isValidJson(jsonSubString) ? jsonSubString : null;
}

/**
 * Determines if a passed string is valid JSON
 *
 * @returns {boolean} if the string is JSON or not
 */
function isValidJson(message) {
  try {
    JSON.parse(message);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Determines if a passed string is numeric (float or integer)
 *
 * @returns {boolean} if the string is numeric or not
 */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Sends a POST request to Elasticsearch.
 */
function post(body, callback) {
  let requestParams = buildRequest(process.env.es_endpoint, body);

  let request = https
    .request(requestParams, function (response) {
      let responseBody = '';
      response.on('data', function (chunk) {
        responseBody += chunk;
      });

      response.on('end', function () {
        let info = JSON.parse(responseBody);
        let failedItems;
        let success;
        let error;

        if (response.statusCode >= 200 && response.statusCode < 299) {
          failedItems = info.items.filter(function (x) {
            return x.index.status >= 300;
          });

          success = {
            attemptedItems: info.items.length,
            failedItems: failedItems.length,
            successfulItems: info.items.length - failedItems.length,
          };
        }

        if (response.statusCode !== 200 || info.errors === true) {
          // prevents logging of failed entries, but allows logging
          // of other errors such as access restrictions
          delete info.items;
          error = {
            responseBody: info,
            statusCode: response.statusCode,
          };
        }

        callback(error, success, response.statusCode, failedItems);
      });
    })
    .on('error', function (e) {
      callback(e);
    });
  request.end(requestParams.body);
}

/**
 * Builds request parameters for a bulk upload to Elasticsearch.
 *
 * @returns {Object} The request parameters.
 */
function buildRequest(endpoint, body) {
  let endpointParts = endpoint.match(
    /^([^.]+)\.?([^.]*)\.?([^.]*)\.amazonaws\.com$/,
  );
  let region = endpointParts[2];
  let service = endpointParts[3];
  let datetime = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  let date = datetime.substr(0, 8);
  let kDate = hmac('AWS4' + process.env.AWS_SECRET_ACCESS_KEY, date);
  let kRegion = hmac(kDate, region);
  let kService = hmac(kRegion, service);
  let kSigning = hmac(kService, 'aws4_request');

  let request = {
    body: body,
    headers: {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'application/json',
      Host: endpoint,
      'X-Amz-Date': datetime,
      'X-Amz-Security-Token': process.env.AWS_SESSION_TOKEN,
    },
    host: endpoint,
    method: 'POST',
    path: '/_bulk',
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

/**
 * Logs failed responses to the console.
 */
function logFailure(error, failedItems) {
  if (logFailedResponses) {
    console.log('Error: ' + JSON.stringify(error, null, 2));

    if (failedItems && failedItems.length > 0) {
      console.log('Failed Items: ' + JSON.stringify(failedItems, null, 2));
    }
  }
}
