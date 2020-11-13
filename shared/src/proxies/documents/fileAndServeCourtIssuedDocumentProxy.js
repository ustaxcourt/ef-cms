const { post } = require('../requests');

/**
 * fixme
 */
exports.fileAndServeCourtIssuedDocumentInteractor = ({
  applicationContext,
  documentMeta,
}) => {
  const { docketNumber } = documentMeta;
  return post({
    applicationContext,
    body: {
      documentMeta,
    },
    endpoint: `/case-documents/${docketNumber}/court-issued-docket-entry-bestest`,
  });
};
