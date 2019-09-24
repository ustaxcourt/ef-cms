const { handle } = require('../middleware/apiGatewayHelper');

/**
 * used for fetching cases matching the given name, country, state, and/or year filed range
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  handle(event, async () => {
    try {
      event.Records.forEach(function(record) {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);
      });
    } catch (e) {
      console.log('ERROR', e);
      throw e;
    }
  });
