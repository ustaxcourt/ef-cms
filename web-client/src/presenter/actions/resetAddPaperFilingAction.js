import { state } from 'cerebral';

/**
 * resets everything in the state for the add paper filing page
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const resetAddPaperFilingAction = ({ store }) => {
  store.set(state.isEditingDocketEntry, false);
  store.set(state.form.lodged, false);
  store.set(state.form.filersMap, {});
  store.set(state.form.filers, []);
  store.set(state.form.practitioner, []);
  store.set(state.wizardStep, 'PrimaryDocumentForm');
  store.set(state.currentViewMetadata.documentUploadMode, 'scan');
  store.set(
    state.currentViewMetadata.documentSelectedForScan,
    'primaryDocumentFile',
  );
};
