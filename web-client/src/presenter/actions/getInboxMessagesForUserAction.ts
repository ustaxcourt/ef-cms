import { state } from '@web-client/presenter/app.cerebral';

/**
 * fetches the inbox messages for the user
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{Message: Array}>} a list of messages
 */
export const getInboxMessagesForUserAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const user = get(state.user);
  const messages = await applicationContext
    .getUseCases()
    .getInboxMessagesForUserInteractor(applicationContext, {
      userId: user.userId,
    });

  return { messages };
};
