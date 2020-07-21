import { state } from 'cerebral';

/**
 * sets the modal state when selecting the chambers section
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @returns {undefined}
 */
export const setCreateCaseMessageModalForChambersSelectAction = ({ store }) => {
  store.set(state.modal.showChambersSelect, true);
  store.unset(state.modal.form.toSection);
  store.unset(state.modal.form.assigneeId);
};
