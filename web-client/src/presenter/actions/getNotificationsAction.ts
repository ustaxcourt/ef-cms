import { state } from '@web-client/presenter/app.cerebral';

/**
 * Fetches notifications for a user
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {function} providers.get the cerebral get method
 * @returns {object} contains the caseDetail returned from the use case
 */
export const getNotificationsAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const user = get(state.user);
  const judgeId = get(state.judgeUser.userId);
  const sectionToDisplay =
    get(state.messageBoxToDisplay.section) ||
    get(state.workQueueToDisplay.section);

  if (!user.section) {
    throw new Error('Unable to fetch work items without a section');
  }

  const notifications = await applicationContext
    .getUseCases()
    .getNotificationsInteractor(applicationContext, {
      judgeId,
      section: user.section,
      selectedSection: sectionToDisplay,
    });

  return { notifications };
};
