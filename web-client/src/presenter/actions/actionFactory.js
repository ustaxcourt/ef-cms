import { getDefaultAttachmentViewerDocumentToDisplayAction } from './getDefaultAttachmentViewerDocumentToDisplayAction';
import { getDefaultAttachmentViewerDocumentToDisplayAction as getDefaultAttachmentViewerDocumentToDisplayActionOld } from './getDefaultAttachmentViewerDocumentToDisplayAction.old';

import { openCaseDocumentDownloadUrlAction } from './openCaseDocumentDownloadUrlAction';
import { getDefaultAttachmentViewerDocumentToDisplayAction as openCaseDocumentDownloadUrlActionOld } from './openCaseDocumentDownloadUrlAction.old';

import { setAddEditUserCaseNoteModalStateFromDetailAction } from './TrialSessionWorkingCopy/setAddEditUserCaseNoteModalStateFromDetailAction';
import { setJudgesCaseNoteOnCaseDetailAction } from './TrialSession/setJudgesCaseNoteOnCaseDetailAction';
import { setViewerDocumentToDisplayAction } from './setViewerDocumentToDisplayAction';

import { setAddEditUserCaseNoteModalStateFromDetailAction as setAddEditUserCaseNoteModalStateFromDetailActionOld } from './TrialSessionWorkingCopy/setAddEditUserCaseNoteModalStateFromDetailAction.old';
import { setJudgesCaseNoteOnCaseDetailAction as setJudgesCaseNoteOnCaseDetailActionOld } from './TrialSession/setJudgesCaseNoteOnCaseDetailAction.old';
import { setViewerDocumentToDisplayAction as setViewerDocumentToDisplayActionOld } from './setViewerDocumentToDisplayAction.old';

import { generateTitleAction } from './FileDocument/generateTitleAction';
import { generateTitleForPaperFilingAction } from './FileDocument/generateTitleForPaperFilingAction';

import { isCodeDisabled } from '../../../../codeToggles';

// TODO: Gradually add more actions as needed
const actions = {
  generateTitleForPaperFilingAction,
  getDefaultAttachmentViewerDocumentToDisplayAction,
  openCaseDocumentDownloadUrlAction,
  setAddEditUserCaseNoteModalStateFromDetailAction,
  setJudgesCaseNoteOnCaseDetailAction,
  setViewerDocumentToDisplayAction,
};

if (isCodeDisabled(6979)) {
  actions.setAddEditUserCaseNoteModalStateFromDetailAction = setAddEditUserCaseNoteModalStateFromDetailActionOld;
  actions.setJudgesCaseNoteOnCaseDetailAction = setJudgesCaseNoteOnCaseDetailActionOld;
}

if (isCodeDisabled(6916)) {
  actions.generateTitleForPaperFilingAction = generateTitleAction;
}

if (isCodeDisabled(6938)) {
  actions.setViewerDocumentToDisplayAction = setViewerDocumentToDisplayActionOld;
}

if (isCodeDisabled(7015)) {
  actions.getDefaultAttachmentViewerDocumentToDisplayAction = getDefaultAttachmentViewerDocumentToDisplayActionOld;
}

if (isCodeDisabled(6841)) {
  actions.openCaseDocumentDownloadUrlAction = openCaseDocumentDownloadUrlActionOld;
}

export const getAction = actionName => actions[actionName];
