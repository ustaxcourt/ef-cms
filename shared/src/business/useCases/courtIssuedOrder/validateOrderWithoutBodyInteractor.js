/**
 * validateOrderWithoutBodyInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.orderMetadata the order data to validate
 * @returns {object} errors (null if no errors)
 */
exports.validateOrderWithoutBodyInteractor = ({
  applicationContext,
  orderMetadata,
}) => {
  const orderWithoutBody = new (applicationContext.getEntityConstructors().OrderWithoutBody)(
    orderMetadata,
  );

  return orderWithoutBody.getFormattedValidationErrors();
};
