import { state } from 'cerebral';

/**
 * get the caseDetail petitioners pendingEmail attribute
 *
 * @param {object} providers.applicationContext the applicationContext
 * @param {function} providers.props the cerebral props
 * @returns {object} the list of petitioner pending emails with their associated contactId
 */
export const getUserPendingEmailForPetitionerOnCaseAction = async ({
  applicationContext,
  get,
}) => {
  let petitionerPendingEmails = [];

  const { petitioners } = get(state.caseDetail);

  for (let petitioner of petitioners) {
    if (petitioner.contactId) {
      const pendingEmail = await applicationContext
        .getUseCases()
        .getUserPendingEmailInteractor({
          applicationContext,
          userId: petitioner.contactId,
        });
      petitionerPendingEmails.push({ [petitioner.contactId]: pendingEmail });
    }
  }

  return { petitionerPendingEmails };
};
