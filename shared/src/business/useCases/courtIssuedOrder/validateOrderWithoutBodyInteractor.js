/**
 * validateOrderWithoutBodyInteractor
 * @param applicationContext
 * @param orderMetadata
 * @returns {object} errors (null if no errors)
 */
exports.validateOrderWithoutBodyInteractor = ({
  applicationContext,
  orderMetadata,
}) => {
  const orderWithoutBody = new (applicationContext.getEntityConstructors()).OrderWithoutBody(
    orderMetadata,
  );

  return orderWithoutBody.getFormattedValidationErrors();
};
