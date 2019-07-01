import { state } from 'cerebral';

/**
 * stash wizard data in props
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 */
export const stashCreateOrderModalDataAction = ({ get, store }) => {
  const { documentTitle, documentType, eventCode } = get(state.form);
  store.set(state.screenMetadata.orderData, {
    documentTitle,
    documentType,
    eventCode,
  });
};
