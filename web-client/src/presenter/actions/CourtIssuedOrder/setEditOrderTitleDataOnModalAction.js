import { state } from 'cerebral';

/**
 * setCreateOrderModalDataOnFormAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setEditOrderTitleDataOnModalAction = ({ get, store }) => {
  const { documentTitle, eventCode } = get(state.form);

  store.set(state.modal.eventCode, eventCode);
  store.set(state.modal.documentTitle, documentTitle);
};
