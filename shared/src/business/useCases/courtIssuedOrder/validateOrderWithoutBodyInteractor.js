/**
 * validateOrderWithoutBody
 * @param applicationContext
 * @param orderMetadata
 * @returns {object} errors (null if no errors)
 */
exports.validateOrderWithoutBody = ({ applicationContext, orderMetadata }) => {
  const orderWithoutBody = new (applicationContext.getEntityConstructors()).OrderWithoutBody(
    orderMetadata,
  );

  return orderWithoutBody.getFormattedValidationErrors();
};
