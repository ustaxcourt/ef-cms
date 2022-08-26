const {
  CourtIssuedDocumentFactory,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentFactory');

/**
 * validateCourtIssuedDocketEntryInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.entryMetadata the docket entry metadata
 * @returns {object} errors (null if no errors)
 */
exports.validateCourtIssuedDocketEntryInteractor = ({ entryMetadata }) => {
  const courtIssuedDocument = CourtIssuedDocumentFactory(entryMetadata);

  return courtIssuedDocument.getFormattedValidationErrors();
};
