/**
 * Removes the base path (the top-level folder) from the request URL.
 *
 * @param {object} event the AWS event object
 * @param {object} context the context
 * @param {object} callback the callback
 */
exports.handler = (event, context, callback) => {
  const { request } = event.Records[0].cf;
  request.uri = `/${[...request.uri.split('/').slice(2)].join('/')}`;
  callback(null, request);
};
