const {
  DocketEntryFactory,
} = require('../../entities/docketEntry/DocketEntryFactory');

/**
 * validateDocketEntryInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.entryMetadata the docket entry metadata
 * @returns {object} errors (null if no errors)
 */
exports.validateDocketEntryInteractor = ({
  applicationContext,
  entryMetadata,
}) => {
  const docketEntry = DocketEntryFactory(entryMetadata, { applicationContext });
  return docketEntry.getFormattedValidationErrors();
};
