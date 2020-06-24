import { state } from 'cerebral';

/**
 * redirects to the draft documents page
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 *
 * @returns {object} object with a path and alert success
 */
export const skipSigningOrderForMessageAction = ({ get }) => {
  const { caseId } = get(state.caseDetail);
  const parentMessageId = get(state.parentMessageId);

  return {
    alertSuccess: {
      message:
        'Your document has been successfully created and attached to this message',
    },
    path: `/case-messages/${caseId}/message-detail/${parentMessageId}`,
  };
};
