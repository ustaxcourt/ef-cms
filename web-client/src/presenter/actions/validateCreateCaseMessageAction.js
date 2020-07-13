import { state } from 'cerebral';

/**
 * validates the create case message modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the path to take if validation fails or not
 * @param {object} providers.applicationContext the application context needed for getting the validateForwardMessage use case
 * @returns {object} path.success or path.error
 */
export const validateCreateCaseMessageAction = ({
  applicationContext,
  get,
  path,
}) => {
  const message = get(state.modal.form);

  const errors = applicationContext
    .getUseCases()
    .validateCreateCaseMessageInteractor({
      applicationContext,
      message,
    });

  if (!errors) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
