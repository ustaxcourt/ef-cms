import { OrderWithoutBody } from '../../entities/orders/OrderWithoutBody';

/**
 * validateOrderWithoutBodyInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.orderMetadata the order data to validate
 * @returns {object} errors (null if no errors)
 */
export const validateOrderWithoutBodyInteractor = (
  applicationContext: IApplicationContext,
  { orderMetadata }: { orderMetadata: any },
) => {
  const orderWithoutBody = new OrderWithoutBody(orderMetadata, {
    applicationContext,
  });

  return orderWithoutBody.getFormattedValidationErrors();
};
