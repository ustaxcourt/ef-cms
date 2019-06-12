import _ from 'lodash';

/**
 * fetch the sent work items for a user.  A sent work item is when a user marks a work item as completed.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getSentWorkItemsForUser use case
 * @returns {object} a list of sent work items for that user who sent them
 */
export const getSentWorkItemsForUserAction = async ({ applicationContext }) => {
  let workItems = await applicationContext
    .getUseCases()
    .getSentWorkItemsForUser({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });
  workItems = _.orderBy(workItems, 'createdAt', 'desc');
  return { workItems };
};
