const {
  ExternalDocumentNonStandardA,
} = require('./ExternalDocumentNonStandardA');
const {
  ExternalDocumentNonStandardB,
} = require('./ExternalDocumentNonStandardB');
const {
  ExternalDocumentNonStandardC,
} = require('./ExternalDocumentNonStandardC');
const {
  ExternalDocumentNonStandardD,
} = require('./ExternalDocumentNonStandardD');
const {
  ExternalDocumentNonStandardE,
} = require('./ExternalDocumentNonStandardE');
const {
  ExternalDocumentNonStandardF,
} = require('./ExternalDocumentNonStandardF');
const {
  ExternalDocumentNonStandardG,
} = require('./ExternalDocumentNonStandardG');
const {
  ExternalDocumentNonStandardH,
} = require('./ExternalDocumentNonStandardH');
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
  if (documentMetadata && documentMetadata.scenario) {
    const scenario = documentMetadata.scenario.toLowerCase().trim();
    switch (scenario) {
      case 'nonstandard a':
        return new ExternalDocumentNonStandardA(documentMetadata);
      case 'nonstandard b':
        return new ExternalDocumentNonStandardB(documentMetadata);
      case 'nonstandard c':
        return new ExternalDocumentNonStandardC(documentMetadata);
      case 'nonstandard d':
        return new ExternalDocumentNonStandardD(documentMetadata);
      case 'nonstandard e':
        return new ExternalDocumentNonStandardE(documentMetadata);
      case 'nonstandard f':
        return new ExternalDocumentNonStandardF(documentMetadata);
      case 'nonstandard g':
        return new ExternalDocumentNonStandardG(documentMetadata);
      case 'nonstandard h':
        return new ExternalDocumentNonStandardH(documentMetadata);
    }
  }

  // standard - default
  return new ExternalDocumentStandard(documentMetadata);
};

module.exports = { ExternalDocumentFactory };
