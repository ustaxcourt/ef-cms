import { state } from 'cerebral';

/**
 * sets the state.judgesNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.userNote
 * @param {object} providers.store the cerebral store used for setting the state
 */
export const setJudgesCaseNoteOnCaseDetailAction = ({ props, store }) => {
  store.set(state.judgesNote, props.userNote);
};
