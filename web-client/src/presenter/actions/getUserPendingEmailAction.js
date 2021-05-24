/**
 * get the caseDetail contact primary's pendingEmail attribute
 *
 * @param {object} providers.applicationContext the applicationContext
 * @param {function} providers.props the cerebral props
 * @returns {object} the userPendingEmail
 */
export const getUserPendingEmailAction = async ({
  applicationContext,
  props,
}) => {
  const { contactId } = props;

  const userPendingEmail = await applicationContext
    .getUseCases()
    .getUserPendingEmailInteractor(applicationContext, {
      userId: contactId,
    });

  return { userPendingEmail };
};
