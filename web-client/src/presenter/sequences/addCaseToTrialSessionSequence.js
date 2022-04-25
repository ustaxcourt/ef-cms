import { addCaseToTrialSessionAction } from '../actions/CaseDetail/addCaseToTrialSessionAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setTrialSessionJudgeAction } from '../actions/setTrialSessionJudgeAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateAddToTrialSessionAction } from '../actions/CaseDetail/validateAddToTrialSessionAction';

const showSuccessAlert = [
  clearModalStateAction,
  setAlertSuccessAction,
  setTrialSessionJudgeAction,
  getCaseAction,
  setCaseAction,
];

const successPath = [
  getTrialSessionsAction,
  setTrialSessionsAction,
  unsetWaitingForResponseAction,
  showSuccessAlert,
  getConsolidatedCasesByCaseAction,
  setConsolidatedCasesForCaseAction,
];

const errorPath = [
  clearModalStateAction,
  setAlertErrorAction,
  unsetWaitingForResponseAction,
];

export const addCaseToTrialSessionSequence = [
  clearScreenMetadataAction,
  startShowValidationAction,
  validateAddToTrialSessionAction,
  {
    error: [setValidationErrorsAction],
    success: [
      showProgressSequenceDecorator([
        setWaitingForResponseAction,
        clearModalAction,
        addCaseToTrialSessionAction,
        {
          error: [errorPath],
          success: successPath,
        },
      ]),
    ],
  },
];
