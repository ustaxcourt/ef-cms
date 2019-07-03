import { state } from 'cerebral';

/**
 * update form values for create order modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the passed in props
 * @param {Function} providers.get the cerebral get helper function
 * @param {Function} providers.store the cerebral store helper function
 */
export const updateCreateOrderModalFormValueAction = ({
  get,
  props,
  store,
}) => {
  const { key, value } = props;
  if (key === 'eventCode') {
    if (value) {
      const eventCode = value;
      store.set(state.form.eventCode, eventCode);

      const { ORDER_TYPES_MAP } = get(state.constants);

      const entry = ORDER_TYPES_MAP.find(item => {
        return item.eventCode === eventCode;
      });
      store.set(state.form.documentType, entry.documentType);
      if (eventCode !== 'O') {
        store.set(state.form.documentTitle, entry.documentTitle);
      } else {
        store.unset(state.form.documentTitle);
      }
    } else {
      store.unset(state.form.eventCode);
      store.unset(state.form.documentType);
      store.unset(state.form.documentTitle);
    }
  } else if (key === 'documentTitle') {
    if (value) {
      store.set(state.form.documentTitle, value);
    } else {
      store.unset(state.form.documentTitle);
    }
  }
};
