const { DocketEntry } = require('../entities/DocketEntry');

/**
 * validateDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.document the document to be validated
 * @returns {object} the validation errors or null
 */
exports.validateDocumentInteractor = (applicationContext, { document }) => {
  const errors = new DocketEntry(document, {
    applicationContext,
  }).getFormattedValidationErrors();

  return errors || null;
};
