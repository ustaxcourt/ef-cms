import { state } from 'cerebral';

/**
 * get the caseDetail pendingEmails attribute
 *
 * @param {object} providers.applicationContext the applicationContext
 * @param {function} providers.props the cerebral props
 * @returns {object} the list of pending emails with their associated contactId
 */
export const getPendingEmailsOnCaseAction = async ({
  applicationContext,
  get,
}) => {
  let pendingEmails = {};

  const { irsPractitioners, petitioners, privatePractitioners } = get(
    state.caseDetail,
  );

  for (let petitioner of petitioners) {
    const pendingEmail = await applicationContext
      .getUseCases()
      .getUserPendingEmailInteractor({
        applicationContext,
        userId: petitioner.contactId,
      });
    pendingEmails[petitioner.contactId] = pendingEmail;
  }

  for (let respondent of irsPractitioners) {
    const pendingEmail = await applicationContext
      .getUseCases()
      .getUserPendingEmailInteractor({
        applicationContext,
        userId: respondent.userId,
      });
    pendingEmails[respondent.userId] = pendingEmail;
  }

  for (let privatePractitioner of privatePractitioners) {
    const pendingEmail = await applicationContext
      .getUseCases()
      .getUserPendingEmailInteractor({
        applicationContext,
        userId: privatePractitioner.userId,
      });
    pendingEmails[privatePractitioner.userId] = pendingEmail;
  }

  return { pendingEmails };
};
