import { state } from 'cerebral';

/**
 * unstash order data from screenMetadata into form
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 */
export const unstashCreateOrderModalDataAction = ({ get, store }) => {
  const documentTitle = get(state.screenMetadata.orderData.documentTitle);
  const documentType = get(state.screenMetadata.orderData.documentType);
  const eventCode = get(state.screenMetadata.orderData.eventCode);

  if (documentTitle && documentType && eventCode) {
    store.set(state.form, {
      documentTitle,
      documentType,
      eventCode,
    });
  }
};
