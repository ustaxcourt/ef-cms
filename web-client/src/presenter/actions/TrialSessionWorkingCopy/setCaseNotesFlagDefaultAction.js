import { state } from 'cerebral';

/**
 * Sets the case notes flag for the printable trial session working copy
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */

export const setCaseNotesFlagDefaultAction = ({ store }) => {
  store.set(state.modal['caseNotesFlag'], true);
};
