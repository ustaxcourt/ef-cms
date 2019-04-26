import { state } from 'cerebral';

export const setMessageAsReadAction = async ({ applicationContext, get }) => {
  await applicationContext.getUseCases().setMessageAsRead({
    applicationContext,
    messageId: get(state.messageId),
  });
};
