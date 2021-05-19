import { state } from 'cerebral';

/**
 * get the caseDetail pendingEmails attribute
 *
 * @param {object} providers.applicationContext the applicationContext
 * @param {function} providers.get the cerebral get
 * @returns {object} an object containing pending emails with their associated contactId
 */
export const getPendingEmailsOnCaseAction = async ({
  applicationContext,
  get,
}) => {
  let pendingEmails = {};

  const { irsPractitioners, petitioners, privatePractitioners } = get(
    state.caseDetail,
  );

  const userIds = [
    ...petitioners.map(petitioner => petitioner.contactId),
    ...irsPractitioners.map(irsPractitioner => irsPractitioner.userId),
    ...privatePractitioners.map(
      privatePractitioner => privatePractitioner.userId,
    ),
  ];

  if (userIds.length) {
    pendingEmails = await applicationContext
      .getUseCases()
      .getUsersPendingEmailInteractor({ applicationContext, userIds });
  }

  return { pendingEmails };
};
