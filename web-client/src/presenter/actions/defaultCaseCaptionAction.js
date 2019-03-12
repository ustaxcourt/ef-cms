import { state } from 'cerebral';

/**
 * defaults the caption to the editable items.
 * state.caseCaption used for the caption.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for setting showModal
 */
export const defaultCaseCaptionAction = ({ store, get }) => {
  const caseDetail = { ...get(state.caseDetail) };
  const CASE_CAPTION_POSTFIX =
    'v. Commissioner of Internal Revenue, Respondent';
  let { caseTitle } = caseDetail;

  caseTitle = caseTitle.replace(CASE_CAPTION_POSTFIX, '').trim();

  store.set(state.caseCaption, caseTitle);
};
