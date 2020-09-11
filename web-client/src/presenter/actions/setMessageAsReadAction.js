/**
 * sets the given message as read
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 */
export const setMessageAsReadAction = async ({ applicationContext, props }) => {
  const { messageToMarkRead } = props;

  await applicationContext.getUseCases().setMessageAsReadInteractor({
    applicationContext,
    docketNumber: messageToMarkRead.docketNumber,
    messageId: messageToMarkRead.messageId,
  });
};
