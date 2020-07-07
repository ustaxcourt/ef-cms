import { state } from 'cerebral';

/**
 * update props from modal state to pass to other actions
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new props from modal state
 */
export const updateCaseMessageDetailsFromModalAction = ({ get }) => {
  const modalFormMessage = get(state.modal.form);

  const message = {
    assigneeId: modalFormMessage.toUserId,
    message: modalFormMessage.subject,
    section: modalFormMessage.toSection,
  };

  return { message };
};
