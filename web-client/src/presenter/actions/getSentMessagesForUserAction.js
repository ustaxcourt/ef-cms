import { orderBy } from 'lodash';

/**
 * fetches the sent messages for a use.
 *
 * @param {object} applicationContext object that contains all the context specific methods
 * @returns {object} a list of sent work items for that user who sent them
 */
export const getSentMessagesForUserAction = async ({ applicationContext }) => {
  let workItems = await applicationContext
    .getUseCases()
    .getSentMessagesForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
  workItems = orderBy(workItems, 'createdAt', 'desc');
  return { workItems };
};
