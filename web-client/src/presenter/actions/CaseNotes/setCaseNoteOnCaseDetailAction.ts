import { state } from 'cerebral';

/**
 * sets the state.caseDetail.caseNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail.caseNote
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setCaseNoteOnCaseDetailAction = ({ props, store }) => {
  store.set(state.caseDetail.caseNote, props.caseDetail.caseNote);
};
