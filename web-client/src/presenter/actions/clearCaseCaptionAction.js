import { state } from 'cerebral';

/**
 * clears the caption.
 * state.caseCaption used for the caption.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for setting showModal
 */
export const clearCaseCaptionAction = ({ store }) => {
  store.set(state.caseCaption, '');
};
