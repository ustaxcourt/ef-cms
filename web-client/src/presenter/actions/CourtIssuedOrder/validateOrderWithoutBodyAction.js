import { state } from 'cerebral';

/**
 * validates the create order modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the validation use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateOrderWithoutBodyAction = ({
  applicationContext,
  get,
  path,
}) => {
  const orderMetadata = get(state.modal);

  const errors = applicationContext
    .getUseCases()
    .validateOrderWithoutBodyInteractor(applicationContext, {
      orderMetadata,
    });

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayOrder = ['eventCode', 'documentTitle'];

    return path.error({
      errorDisplayOrder,
      errors,
    });
  }
};
