import { setAddEditUserCaseNoteModalStateFromDetailAction } from './TrialSessionWorkingCopy/setAddEditUserCaseNoteModalStateFromDetailAction';
import { setJudgesCaseNoteOnCaseDetailAction } from './TrialSession/setJudgesCaseNoteOnCaseDetailAction';

import { setAddEditUserCaseNoteModalStateFromDetailAction as setAddEditUserCaseNoteModalStateFromDetailAction6979 } from './TrialSessionWorkingCopy/setAddEditUserCaseNoteModalStateFromDetailAction.6979';
import { setJudgesCaseNoteOnCaseDetailAction as setJudgesCaseNoteOnCaseDetailAction6979 } from './TrialSession/setJudgesCaseNoteOnCaseDetailAction.6979';

import { isCodeEnabled } from '../../../../codeToggles';

// TODO: Gradually add more actions as needed
const actions = {
  setAddEditUserCaseNoteModalStateFromDetailAction,
  setJudgesCaseNoteOnCaseDetailAction,
};

if (isCodeEnabled(6979)) {
  actions.setAddEditUserCaseNoteModalStateFromDetailAction = setAddEditUserCaseNoteModalStateFromDetailAction6979;
  actions.setJudgesCaseNoteOnCaseDetailAction = setJudgesCaseNoteOnCaseDetailAction6979;
}

export const getAction = actionName => actions[actionName];
