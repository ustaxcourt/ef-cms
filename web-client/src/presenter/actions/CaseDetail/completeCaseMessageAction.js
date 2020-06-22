import { state } from 'cerebral';

/**
 * completes a case message thread
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {object} the alert success
 */
export const completeCaseMessageAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const form = get(state.modal.form);
  const { mostRecentMessage } = props;

  const {
    docketNumber,
    parentMessageId,
  } = await applicationContext.getUseCases().completeCaseMessageInteractor({
    applicationContext,
    parentMessageId: mostRecentMessage.parentMessageId,
    ...form,
  });

  return {
    alertSuccess: {
      message: 'Your message has been sent.',
    },
    docketNumber,
    parentMessageId,
  };
};
