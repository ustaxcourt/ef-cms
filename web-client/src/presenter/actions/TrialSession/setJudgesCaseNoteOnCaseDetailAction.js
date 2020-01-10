import { state } from 'cerebral';

/**
 * sets the state.caseDetail.judgesNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.judgesNote
 * @param {object} providers.store the cerebral store used for setting the state.caeDetail
 */
export const setJudgesCaseNoteOnCaseDetailAction = ({ props, store }) => {
  store.set(state.caseDetail.judgesNote, props.judgesNote);
};
