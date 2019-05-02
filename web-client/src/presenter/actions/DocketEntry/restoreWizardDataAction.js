import { state } from 'cerebral';

/**
 * restore wizard data
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object
 * @param {Object} providers.props the cerebral props object
 */
export const restoreWizardDataAction = async ({ store, props }) => {
  const { filedDocumentIds } = props;
  store.set(state.screenMetadata.filedDocumentIds, filedDocumentIds);
};
