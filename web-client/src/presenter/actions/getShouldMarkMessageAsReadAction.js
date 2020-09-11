import { state } from 'cerebral';

/**
 * returns the path based on whether the message should be marked as read
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.path the cerebral path which contains the next paths that can be invoked
 * @returns {object} continue path for the sequence
 */
export const getShouldMarkMessageAsReadAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const { userId } = applicationContext.getCurrentUser();
  const messageDetail = get(state.messageDetail);

  if (messageDetail[0].toUserId === userId && !messageDetail[0].isRead) {
    return path.markRead();
  } else {
    return path.noAction();
  }
};
