import { state } from '@web-client/presenter/app.cerebral';

/**
 * fetches the document qc inbox work items for a user,
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {Promise<{workItems: Array}>} a list of work items
 */
export const getDocumentQCInboxForUserAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const user = get(state.user);
  const workItems = await applicationContext
    .getUseCases()
    .getDocumentQCInboxForUserInteractor(applicationContext, {
      userId: user.userId,
    });

  return { workItems };
};
