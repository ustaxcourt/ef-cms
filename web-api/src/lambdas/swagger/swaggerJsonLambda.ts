import { handle } from '../../middleware/apiGatewayHelper';
import swagger from '../../../swagger.json';

/**
 * return the swagger.json file
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const swaggerJsonLambda = event =>
  /**
   * return the swagger.json file
   *
   * @param {object} event the AWS event object
   * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
   */
  handle(event, () => swagger);
