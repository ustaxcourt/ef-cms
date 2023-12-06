import { state } from '@web-client/presenter/app.cerebral';

/**
 * unsets the modal state
 * state.modal used for temp modal state
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting showModal
 */
export const clearModalStateAction = ({ store }: ActionProps) => {
  store.set(state.modal, {});
};
