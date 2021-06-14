import { map } from 'lodash';
import { state } from 'cerebral';

/**
 * get the pending email status only for petitioners and practitioners on a case
 *
 * @param {object} providers.applicationContext the applicationContext
 * @param {function} providers.get the cerebral get
 * @returns {object} an object containing pending emails with their associated contactId
 */
export const getPendingEmailStatusOnCaseAction = async ({
  applicationContext,
  get,
}) => {
  let pendingEmails = {};

  const { irsPractitioners, petitioners, privatePractitioners } = get(
    state.caseDetail,
  );

  const userIds = [
    ...map(petitioners, 'contactId'),
    ...map(irsPractitioners, 'userId'),
    ...map(privatePractitioners, 'userId'),
  ];

  if (userIds.length) {
    pendingEmails = await applicationContext
      .getUseCases()
      .getUsersPendingEmailStatusesInteractor(applicationContext, { userIds });
  }

  return { pendingEmails };
};
