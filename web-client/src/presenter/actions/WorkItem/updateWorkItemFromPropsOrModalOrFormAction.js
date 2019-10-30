import { state } from 'cerebral';

/**
 * update props from modal state to pass to other actions
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new props from modal state
 */
export const updateWorkItemFromPropsOrModalOrFormAction = ({ get, props }) => {
  let fromModal = false;
  let { message } = props;

  if (!message && (message = get(state.modal.form))) {
    fromModal = true;
  }

  if (!message) {
    message = get(state.form);
  }

  return { fromModal, message };
};
