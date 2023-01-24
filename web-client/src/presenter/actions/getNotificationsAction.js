import { state } from 'cerebral';

/**
 * Fetches notifications for a user
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {function} providers.get the cerebral get method
 * @returns {object} contains the caseDetail returned from the use case
 */
export const getNotificationsAction = async ({ applicationContext, get }) => {
  const judgeUserId = get(state.judgeUser.userId);
  const selectedSection = get(state.messageBoxToDisplay.section);
  let caseServicesSupervisorInfo;

  if (selectedSection) {
    caseServicesSupervisorInfo = {
      section: selectedSection,
      userId: applicationContext.getCurrentUser().userId,
    };
  }

  const notifications = await applicationContext
    .getUseCases()
    .getNotificationsInteractor(applicationContext, {
      caseServicesSupervisorInfo,
      judgeUserId,
    });

  return { notifications };
};
