import { state } from 'cerebral';

/**
 * resets everything in the state for the add docket entry page
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.users
 */
export const unsetDocumentIdAction = ({ store }) => {
  store.set(state.isEditingDocketEntry, false);
  store.set(state.form.lodged, false);
  store.set(state.form.practitioner, []);
  store.set(state.wizardStep, 'PrimaryDocumentForm');
  store.set(state.documentUploadMode, 'scan');
  store.set(state.documentSelectedForScan, 'primaryDocumentFile');
};
