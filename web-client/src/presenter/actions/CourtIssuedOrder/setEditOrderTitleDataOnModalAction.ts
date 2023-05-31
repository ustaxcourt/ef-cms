import { state } from 'cerebral';

/**
 * setCreateOrderModalDataOnFormAction
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setEditOrderTitleDataOnModalAction = ({
  get,
  store,
}: ActionProps) => {
  const { documentTitle, documentType, eventCode } = get(state.form);

  store.set(state.modal.eventCode, eventCode);
  store.set(state.modal.documentTitle, documentTitle);
  store.set(state.modal.documentType, documentType);
};
