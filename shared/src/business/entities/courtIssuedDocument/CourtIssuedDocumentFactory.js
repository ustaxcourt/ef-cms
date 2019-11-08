const {
  CourtIssuedDocumentNonStandardA,
} = require('./CourtIssuedDocumentNonStandardA');
const {
  CourtIssuedDocumentNonStandardB,
} = require('./CourtIssuedDocumentNonStandardB');
const {
  CourtIssuedDocumentNonStandardC,
} = require('./CourtIssuedDocumentNonStandardC');
const {
  CourtIssuedDocumentNonStandardD,
} = require('./CourtIssuedDocumentNonStandardD');
const {
  CourtIssuedDocumentNonStandardE,
} = require('./CourtIssuedDocumentNonStandardE');

/**
 *
 * @constructor
 */
function CourtIssuedDocumentFactory() {}

/**
 *
 * @param {object} documentMetadata the document metadata
 * @returns {object} the correct entity based on the document scenario
 */
CourtIssuedDocumentFactory.get = documentMetadata => {
  if (documentMetadata && documentMetadata.scenario) {
    const scenario = documentMetadata.scenario.toLowerCase().trim();
    switch (scenario) {
      case 'nonstandard a':
        return new CourtIssuedDocumentNonStandardA(documentMetadata);
      case 'nonstandard b':
        return new CourtIssuedDocumentNonStandardB(documentMetadata);
      case 'nonstandard c':
        return new CourtIssuedDocumentNonStandardC(documentMetadata);
      case 'nonstandard d':
        return new CourtIssuedDocumentNonStandardD(documentMetadata);
      case 'nonstandard e':
        return new CourtIssuedDocumentNonStandardE(documentMetadata);
    }
  }
};

module.exports = { CourtIssuedDocumentFactory };
