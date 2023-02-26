import { state } from 'cerebral';

/**
 * sets various state properties for the edit paper filing form
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setupEditPaperFilingAction = ({ store }) => {
  store.set(state.isEditingDocketEntry, true);
  store.set(state.wizardStep, 'PrimaryDocumentForm');
  store.set(state.currentViewMetadata.documentUploadMode, 'scan');
  store.set(
    state.currentViewMetadata.documentSelectedForScan,
    'primaryDocumentFile',
  );
};
