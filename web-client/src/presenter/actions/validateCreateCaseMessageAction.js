import { state } from 'cerebral';

/**
 * validates the create case message modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or failure)
 * @param {object} providers.props the cerebral props object
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
