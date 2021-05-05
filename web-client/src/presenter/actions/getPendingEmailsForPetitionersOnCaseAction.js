import { state } from 'cerebral';

/**
 * get the caseDetail petitioners pendingEmail attribute
 *
 * @param {object} providers.applicationContext the applicationContext
 * @param {function} providers.props the cerebral props
 * @returns {object} the list of petitioner pending emails with their associated contactId
 */
export const getPendingEmailsForPetitionersOnCaseAction = async ({
  applicationContext,
  get,
}) => {
  let pendingEmails = {};

  const { irsPractitioners, petitioners } = get(state.caseDetail);

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

  return { pendingEmails };
};
