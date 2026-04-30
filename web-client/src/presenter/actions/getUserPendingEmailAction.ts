/**
 * get the caseDetail contact primary's pendingEmail attribute
 * @param {object} providers.applicationContext the applicationContext
 * @param {function} providers.props the cerebral props
 * @returns {object} the userPendingEmail
 */
export const getUserPendingEmailAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { contactId } = props;

  const userPendingEmail = await applicationContext
    .getUseCases()
    .getUserPendingEmailInteractor(applicationContext, {
      userId: contactId,
    });

  const { caseDetail } = props;
  const { petitioners = [] } = caseDetail || {};

  const contactIdArray = petitioners.map(p => p.contactId);

  // Returns as object {id#: email}, will put values into an array
  const pendingEmails = await applicationContext
    .getUseCases()
    .getUsersPendingEmailInteractor(applicationContext, {
      userIds: contactIdArray,
    });

  const allPendingEmails = Object.values(pendingEmails);

  return { userPendingEmail, allPendingEmails };
};
