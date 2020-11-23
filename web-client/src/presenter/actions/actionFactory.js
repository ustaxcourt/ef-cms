import { setAddEditUserCaseNoteModalStateFromDetailAction } from './TrialSessionWorkingCopy/setAddEditUserCaseNoteModalStateFromDetailAction';
import { setJudgesCaseNoteOnCaseDetailAction } from './TrialSession/setJudgesCaseNoteOnCaseDetailAction';

import { setAddEditUserCaseNoteModalStateFromDetailAction as setAddEditUserCaseNoteModalStateFromDetailActionOld } from './TrialSessionWorkingCopy/setAddEditUserCaseNoteModalStateFromDetailAction.old';
import { setJudgesCaseNoteOnCaseDetailAction as setJudgesCaseNoteOnCaseDetailActionOld } from './TrialSession/setJudgesCaseNoteOnCaseDetailAction.old';

import { generateTitleAction } from './FileDocument/generateTitleAction';
import { generateTitleForPaperFilingAction } from './FileDocument/generateTitleForPaperFilingAction';

import { isCodeDisabled } from '../../../../codeToggles';

// TODO: Gradually add more actions as needed
const actions = {
  generateTitleForPaperFilingAction,
  setAddEditUserCaseNoteModalStateFromDetailAction,
  setJudgesCaseNoteOnCaseDetailAction,
};

if (isCodeDisabled(6979)) {
  actions.setAddEditUserCaseNoteModalStateFromDetailAction = setAddEditUserCaseNoteModalStateFromDetailActionOld;
  actions.setJudgesCaseNoteOnCaseDetailAction = setJudgesCaseNoteOnCaseDetailActionOld;
}

if (isCodeDisabled(6916)) {
  actions.generateTitleForPaperFilingAction = generateTitleAction;
}

export const getAction = actionName => actions[actionName];
