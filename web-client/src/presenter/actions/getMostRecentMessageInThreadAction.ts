import { orderBy } from 'lodash';
import { state } from 'cerebral';

/**
 * gets the most recent message from state.messageDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @returns {object} object containing mostRecentMessage
 */
export const getMostRecentMessageInThreadAction = ({ get }) => {
  const messageDetail = get(state.messageDetail);

  const sortedMessages = orderBy(messageDetail, 'createdAt', 'desc');

  return { mostRecentMessage: sortedMessages[0] };
};
