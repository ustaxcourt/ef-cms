import { state } from 'cerebral';

/**
 * unstash order data from screenMetadata into form
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 */
export const setCreateOrderModalDataOnFormAction = ({ get, store }) => {
  const { documentTitle, documentType, eventCode, parentMessageId } = get(
    state.modal,
  );

  if (documentTitle && documentType && eventCode) {
    store.set(state.form.documentTitle, documentTitle);
    store.set(state.form.documentType, documentType);
    store.set(state.form.eventCode, eventCode);
    store.set(state.form.parentMessageId, parentMessageId);
    store.set(state.parentMessageId, parentMessageId);
  }
};
