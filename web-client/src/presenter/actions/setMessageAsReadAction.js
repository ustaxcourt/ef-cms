import { state } from 'cerebral';

/**
 * sets the given message as read
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get method
 */
export const setMessageAsReadAction = async ({ applicationContext, get }) => {
  await applicationContext.getUseCases().setMessageAsReadInteractor({
    applicationContext,
    messageId: get(state.messageId),
  });
};
