import { state } from 'cerebral';

/**
 * sets various state properties for getting the complete docket entry page working
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.users
 * @param {object} providers.props the cerebral props object used for getting the props.users
 */
export const setupCompleteDocketEntryAction = ({ store }) => {
  store.set(state.isEditingDocketEntry, true);
  store.set(state.wizardStep, 'PrimaryDocumentForm');
  store.set(state.documentUploadMode, 'scan');
  store.set(state.documentSelectedForScan, 'primaryDocumentFile');
};
