import { state } from 'cerebral';

/**
 * get the caseDetail contact primary and secondary's pendingEmail attribute
 *
 * @param {object} providers.applicationContext the applicationContext
 * @param {function} providers.props the cerebral props
 * @returns {object} the contactPrimaryPendingEmail and contactSecondaryPendingEmail
 */
export const getUserPendingEmailForPrimaryAndSecondaryAction = async ({
  applicationContext,
  get,
}) => {
  const caseDetail = get(state.caseDetail);
  const primaryContactId = applicationContext
    .getUtilities()
    .getContactPrimary(caseDetail)?.contactId;

  const contactPrimaryPendingEmail = await applicationContext
    .getUseCases()
    .getUserPendingEmailInteractor({
      applicationContext,
      userId: primaryContactId,
    });

  const secondaryContactId = applicationContext
    .getUtilities()
    .getContactSecondary(caseDetail)?.contactId;

  const contactSecondaryPendingEmail = await applicationContext
    .getUseCases()
    .getUserPendingEmailInteractor({
      applicationContext,
      userId: secondaryContactId,
    });

  return { contactPrimaryPendingEmail, contactSecondaryPendingEmail };
};
