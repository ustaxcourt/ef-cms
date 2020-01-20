/**
 * validateDocketRecordInteractor
 *
 * @param applicationContext
 * @param docketRecord
 * @returns {object}
 */
exports.validateDocketRecordInteractor = ({
  applicationContext,
  docketRecord,
}) => {
  const errors = new (applicationContext.getEntityConstructors().DocketRecord)(
    docketRecord,
  ).getFormattedValidationErrors();

  return errors || null;
};
