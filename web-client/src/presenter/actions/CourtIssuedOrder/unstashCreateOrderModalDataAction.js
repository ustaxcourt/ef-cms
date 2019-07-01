import { state } from 'cerebral';

/**
 * unstash order data from screenMetadata into form
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 */
export const unstashCreateOrderModalDataAction = ({ get, store }) => {
  const { documentTitle, documentType, eventCode } = get(
    state.screenMetadata.orderData,
  );
  store.set(state.form, {
    documentTitle,
    documentType,
    eventCode,
  });
};
