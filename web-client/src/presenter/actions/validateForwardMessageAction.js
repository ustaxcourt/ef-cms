import { state } from 'cerebral';

/**
 * validates the forward message
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.path the cerebral path which contains the next path in the sequence (path of success or failure)
 * @param {Object} providers.props the cerebral store used for getting the props.workItemId
 * @param {Object} providers.get the cerebral get function used for getting the state.form when validation errors occur
 * @param {Object} providers.applicationContext the application context needed for getting the validateForwardMessage use case
 * @returns {Object} path.success or path.error
 */
export const validateForwardMessageAction = ({
  path,
  props,
  get,
  applicationContext,
}) => {
  const form = get(state.form)[props.workItemId] || {};

  const errors = applicationContext.getUseCases().validateForwardMessage({
    applicationContext,
    message: form,
  });

  if (!errors) {
    return path.success();
  } else {
    return path.error({ errors });
  }
};
