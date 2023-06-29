import { state } from '@web-client/presenter/app.cerebral';

/**
 * unstash order data from screenMetadata into form
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setCreateOrderModalDataOnFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const documentTitle = props.documentTitle || get(state.modal.documentTitle);

  const documentType = props.documentType || get(state.modal.documentType);

  const eventCode = props.eventCode || get(state.modal.eventCode);

  const parentMessageId =
    props.parentMessageId || get(state.modal.parentMessageId);

  if (documentTitle && documentType && eventCode) {
    store.set(state.form.documentTitle, documentTitle);
    store.set(state.form.documentType, documentType);
    store.set(state.form.eventCode, eventCode);
    store.set(state.form.parentMessageId, parentMessageId);
    store.set(state.parentMessageId, parentMessageId);
  }
};
