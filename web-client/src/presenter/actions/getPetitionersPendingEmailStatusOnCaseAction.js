import { state } from 'cerebral';

/**
 * get the pending email status only for petitioners on a case
 *
 * @param {object} providers.applicationContext the applicationContext
 * @param {function} providers.get the cerebral get
 * @returns {object} an object containing pending emails with their associated contactId
 */
export const getPetitionersPendingEmailStatusOnCaseAction = async ({
  applicationContext,
  get,
}) => {
  let pendingEmails = {};

  const { petitioners } = get(state.caseDetail);

  if (petitioners) {
    const userIds = petitioners.map(petitioner => petitioner.contactId);

    pendingEmails = await applicationContext
      .getUseCases()
      .getUsersPendingEmailStatusesInteractor({
        applicationContext,
        userIds,
      });
  }

  return { pendingEmails };
};
