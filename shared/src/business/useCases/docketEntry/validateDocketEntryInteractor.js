/**
 * validateDocketEntryInteractor
 * @param applicationContext
 * @param entryMetadata
 * @returns {object} errors (null if no errors)
 */
exports.validateDocketEntryInteractor = ({
  applicationContext,
  entryMetadata,
}) => {
  const docketEntry = applicationContext
    .getEntityConstructors()
    .DocketEntryFactory(entryMetadata);

  return docketEntry.getFormattedValidationErrors();
};
