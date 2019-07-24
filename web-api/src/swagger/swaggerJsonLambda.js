const swagger = require('../../swagger.json');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * return the swagger.json file
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  /**
   * return the swagger.json file
   *
   * @param {object} event the AWS event object
   * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
   */
  handle(event, () => swagger);
