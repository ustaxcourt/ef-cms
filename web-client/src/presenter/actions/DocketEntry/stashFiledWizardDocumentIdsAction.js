import { state } from 'cerebral';

/**
 * stash the documents filed in the wizard in a prop
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object
 * @param {Object} providers.applicationContext the application context
 * @param {Object} providers.props the cerebral props object
 */
export const stashFiledWizardDocumentIdsAction = async ({ get, props }) => {
  const { primaryDocumentFileId } = props;

  const filedDocumentIds = get(state.screenMetadata.filedDocumentIds) || [];
  filedDocumentIds.push(primaryDocumentFileId);

  return {
    filedDocumentIds,
  };
};
