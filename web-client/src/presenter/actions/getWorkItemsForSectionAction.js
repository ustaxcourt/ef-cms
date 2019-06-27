import { state } from 'cerebral';

/**
 * fetches the work items that are associated with the user's section
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getWorkItemsBySection use case
 * @returns {object} the list of section work items
 */
export const getWorkItemsForSectionAction = async ({
  applicationContext,
  get,
}) => {
  const user = applicationContext.getCurrentUser();
  const workQueueIsInternal = get(state.workQueueIsInternal);

  let { section } = user;
  if (!workQueueIsInternal && user.role !== 'petitionsclerk') {
    section = 'docket';
  }

  let sectionWorkItems = await applicationContext
    .getUseCases()
    .getWorkItemsBySection({
      applicationContext,
      section,
      userId: user.userId,
    });
  return { workItems: sectionWorkItems };
};
