import { state } from 'cerebral';

/**
 * sets the given message as read
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get method
 */
export const setMessageAsReadAction = async ({ applicationContext, get }) => {
  // TODO 6069 - This is returning an array instead of a single object,
  // so we need to make sure we're grabbing the right message here.
  // Also, should we consider marking a thread as read ?
  const messageDetail = get(state.messageDetail);

  await applicationContext.getUseCases().setMessageAsReadInteractor({
    applicationContext,
    docketNumber: messageDetail[0].docketNumber,
    messageId: messageDetail[0].messageId,
  });
};
