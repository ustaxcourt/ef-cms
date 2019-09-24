import { state } from 'cerebral';

/**
 * defaults the caption to the editable items.
 * state.caseCaption used for the caption.
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the get function to retrieve values from state
 * @param {object} providers.store the cerebral store object used for setting showModal
 */
export const defaultCaseCaptionAction = ({ get, store }) => {
  const caseDetail = { ...get(state.caseDetail) };
  let { caseCaption } = caseDetail;
  store.set(state.caseCaption, caseCaption);
};
