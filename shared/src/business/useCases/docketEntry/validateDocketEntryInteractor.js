/**
 * validateDocketEntry
 * @param applicationContext
 * @param entryMetadata
 * @returns {object} errors (null if no errors)
 */
exports.validateDocketEntry = ({ applicationContext, entryMetadata }) => {
  const docketEntry = applicationContext
    .getEntityConstructors()
    .DocketEntryFactory(entryMetadata);

  return docketEntry.getFormattedValidationErrors();
};
