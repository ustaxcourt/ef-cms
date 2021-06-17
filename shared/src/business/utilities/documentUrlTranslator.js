/**
 *
 * @params {object} params the params object
 * @param {string} documentUrl URL to the document in regionalEndpoint.com/bucket/path format
 * @param {boolean} useTempBucket If the document is in the temporary documents or not
 * @param {object} applicationContext the application context
 * @returns {string} the translated URL
 */
exports.documentUrlTranslator = ({
  applicationContext,
  documentUrl,
  useTempBucket,
}) => {
  if (applicationContext.environment.stage === 'local') {
    return documentUrl;
  }

  const url = new URL(documentUrl);
  const path = useTempBucket ? 'temp-documents' : 'documents';

  url.host = applicationContext.getAppEndpoint();
  url.pathname = [path, ...url.pathname.split('/').slice(2)].join('/');

  return url.toString();
};
