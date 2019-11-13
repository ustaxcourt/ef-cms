const { CourtIssuedDocumentTypeA } = require('./CourtIssuedDocumentTypeA');
const { CourtIssuedDocumentTypeB } = require('./CourtIssuedDocumentTypeB');
const { CourtIssuedDocumentTypeC } = require('./CourtIssuedDocumentTypeC');
const { CourtIssuedDocumentTypeD } = require('./CourtIssuedDocumentTypeD');
const { CourtIssuedDocumentTypeE } = require('./CourtIssuedDocumentTypeE');

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
      case 'type a':
        return new CourtIssuedDocumentTypeA(documentMetadata);
      case 'type b':
        return new CourtIssuedDocumentTypeB(documentMetadata);
      case 'type c':
        return new CourtIssuedDocumentTypeC(documentMetadata);
      case 'type d':
        return new CourtIssuedDocumentTypeD(documentMetadata);
      case 'type e':
        return new CourtIssuedDocumentTypeE(documentMetadata);
    }
  }
};

module.exports = { CourtIssuedDocumentFactory };
