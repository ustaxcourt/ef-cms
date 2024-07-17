import { state } from '@web-client/presenter/app.cerebral';

/**
 * completes a message thread
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {object} the alert success
 */
export const completeMessageAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps): Promise<void> => {
  const form = get(state.modal.form);
  const { mostRecentMessage } = props;

  await applicationContext
    .getUseCases()
    .completeMessageInteractor(applicationContext, {
      messages: [
        {
          messageBody: form?.message,
          parentMessageId: mostRecentMessage.parentMessageId,
        },
      ],
    });
};
