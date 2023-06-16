import { state } from '@web-client/presenter/app.cerebral';

/**
 * update modal values for create order modal
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the passed in props
 * @param {Function} providers.store the cerebral store helper function
 */
export const updateCreateOrderModalFormValueAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const { key, value } = props;
  if (key === 'eventCode') {
    if (value) {
      const eventCode = value;
      store.set(state.modal.eventCode, eventCode);

      const { ORDER_TYPES_MAP } = applicationContext.getConstants();

      const entry = ORDER_TYPES_MAP.find(item => {
        return item.eventCode === eventCode;
      });
      store.set(state.modal.documentType, entry.documentType);
      if (eventCode === 'NOT') {
        store.set(state.modal.documentTitle, 'Notice');
      } else if (eventCode === 'O') {
        store.set(state.modal.documentTitle, 'Order');
      } else {
        store.set(state.modal.documentTitle, entry.documentTitle);
      }
    } else {
      store.unset(state.modal.eventCode);
      store.unset(state.modal.documentType);
      store.unset(state.modal.documentTitle);
    }
  } else if (key === 'documentTitle') {
    if (value) {
      store.set(state.modal.documentTitle, value);
    } else {
      store.unset(state.modal.documentTitle);
    }
  }
};
