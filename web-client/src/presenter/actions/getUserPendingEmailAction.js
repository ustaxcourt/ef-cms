import { state } from 'cerebral';

/**
 * get the caseDetail contact primary's pendingEmail attribute
 *
 * @param {object} props.applicationContext the applicationContext
 * @param {function} props.get the cerebral get function
 * @returns {object} the userPendingEmail
 */
export const getUserPendingEmailAction = async ({
  applicationContext,
  get,
}) => {
  const contactId = applicationContext
    .getUtilities()
    .getContactPrimary(get(state.caseDetail))?.contactId;

  const userPendingEmail = await applicationContext
    .getUseCases()
    .getUserPendingEmailInteractor({
      applicationContext,
      userId: contactId,
    });

  return { userPendingEmail };
};
