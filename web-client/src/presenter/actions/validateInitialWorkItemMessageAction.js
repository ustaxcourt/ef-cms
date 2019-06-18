import { state } from 'cerebral';

/**
 * validates the forward message
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or failure)
 * @param {object} providers.get the cerebral get function used for getting the state.form when validation errors occur
 * @param {object} providers.applicationContext the application context needed for getting the validateForwardMessage use case
 * @returns {object} path.success or path.error
 */
export const validateInitialWorkItemMessageAction = ({
  path,
  get,
  applicationContext,
}) => {
  const message = get(state.form);

  const errors = applicationContext
    .getUseCases()
    .validateInitialWorkItemMessage({
      applicationContext,
      message,
    });

  if (!errors) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
