const { ExternalDocumentStandard } = require('./ExternalDocumentStandard');

/**
 *
 * @constructor
 */
function ExternalDocumentFactory() {}

/**
 *
 * @param documentMetadata
 */
ExternalDocumentFactory.get = documentMetadata => {
  return new ExternalDocumentStandard(documentMetadata);
};

module.exports = { ExternalDocumentFactory };
