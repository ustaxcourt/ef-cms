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
  const judgeUserId = get(state.judgeUser.userId);
  const sectionToDisplay =
    get(state.messageBoxToDisplay.section) ||
    get(state.workQueueToDisplay.section);

  let caseServicesSupervisorData;

  if (sectionToDisplay) {
    caseServicesSupervisorData = {
      section: sectionToDisplay,
      userId: applicationContext.getCurrentUser().userId,
    };
  }

  const notifications = await applicationContext
    .getUseCases()
    .getNotificationsInteractor(applicationContext, {
      caseServicesSupervisorData,
      judgeUserId,
    });

  return { notifications };
};
