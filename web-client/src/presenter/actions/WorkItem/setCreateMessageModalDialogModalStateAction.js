import { state } from 'cerebral';

/**
 * set the modal state
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store function
 */
export const setCreateMessageModalDialogModalStateAction = ({ store }) => {
  store.set(state.modal.validationErrors, {});
  store.set(state.modal.form, {
    attachments: [],
  });
};
