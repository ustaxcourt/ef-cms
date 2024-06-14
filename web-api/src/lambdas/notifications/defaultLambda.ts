import { genericHandler } from '../../genericHandler';

/**
 * save the information about a new websocket connection
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const defaultLambda = event =>
  genericHandler(
    event,
    () => {
      // as of right now, this default lambda only exists so that we can send PING messages from the UI and keep
      // the websocket connection to api gateway alive.  API Gateway has a 10 min timeout, so the socket needs traffic (either in / out)
      // at least once before that 10 minutes to have API Gateway not kill the connection.
      //
      // WARNING: If you are adding functionality that accepts client-send websocket events, then you may want to
      // consider readdressing story 10368 to add support for disabling websocket traffic when a color is inactive.
      return null;
    },
    { bypassMaintenanceCheck: true },
  );
