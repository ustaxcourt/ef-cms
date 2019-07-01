import { state } from 'cerebral';

/**
 * stash create order data entered in modal in screenMetadata
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store function
 */
export const stashCreateOrderModalDataAction = ({ get, store }) => {
  const { documentTitle, documentType, eventCode } = get(state.form);
  store.set(state.screenMetadata.orderData, {
    documentTitle,
    documentType,
    eventCode,
  });
};
