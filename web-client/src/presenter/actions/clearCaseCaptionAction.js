import { state } from 'cerebral';

/**
 * clears the caption.
 * state.caseCaption used for the caption.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting showModal
 */
export const clearCaseCaptionAction = ({ store }) => {
  store.set(state.caseCaption, '');
};
