import { state } from 'cerebral';

/**
 * Sets the showCaseNotes flag for the printable trial session working copy
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */

export const setShowCaseNotesDefaultAction = ({ store }) => {
  store.set(state.modal['showCaseNotes'], true);
};
