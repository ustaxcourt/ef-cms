/**
 * returns the path based on whether the message should be marked as read
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path which contains the next paths that can be invoked
 * @param {object} providers.props the cerebral props object
 * @returns {object} continue path for the sequence
 */
export const getShouldMarkMessageAsReadAction = ({
  applicationContext,
  path,
  props,
}) => {
  const { userId } = applicationContext.getCurrentUser();
  const { mostRecentMessage } = props;

  if (mostRecentMessage.toUserId === userId && !mostRecentMessage.isRead) {
    return path.markRead({
      messageToMarkRead: mostRecentMessage,
    });
  } else {
    return path.noAction();
  }
};
