import { setAddEditUserCaseNoteModalStateFromDetailAction } from './TrialSessionWorkingCopy/setAddEditUserCaseNoteModalStateFromDetailAction';
import { setJudgesCaseNoteOnCaseDetailAction } from './TrialSession/setJudgesCaseNoteOnCaseDetailAction';

import { setAddEditUserCaseNoteModalStateFromDetailAction as setAddEditUserCaseNoteModalStateFromDetailActionOld } from './TrialSessionWorkingCopy/setAddEditUserCaseNoteModalStateFromDetailAction.old';
import { setJudgesCaseNoteOnCaseDetailAction as setJudgesCaseNoteOnCaseDetailActionOld } from './TrialSession/setJudgesCaseNoteOnCaseDetailAction.old';

import { isCodeDisabled } from '../../../../codeToggles';

// TODO: Gradually add more actions as needed
const actions = {
  setAddEditUserCaseNoteModalStateFromDetailAction,
  setJudgesCaseNoteOnCaseDetailAction,
};

if (isCodeDisabled(6979)) {
  actions.setAddEditUserCaseNoteModalStateFromDetailAction = setAddEditUserCaseNoteModalStateFromDetailActionOld;
  actions.setJudgesCaseNoteOnCaseDetailAction = setJudgesCaseNoteOnCaseDetailActionOld;
}

export { actions };
