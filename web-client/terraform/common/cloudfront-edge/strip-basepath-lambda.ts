/**
 * Removes the base path (the top-level folder) from the request URL.
 *
 * @param {object} awsEvent the AWS event object
 * @param {object} handlerContext the context
 * @param {object} callback the callback
 */
export const handler = (awsEvent, handlerContext, callback) => {
  const { request } = awsEvent.Records[0].cf;
  request.uri = `/${[...request.uri.split('/').slice(2)].join('/')}`;
  callback(null, request);
};
