import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { getTrialSessionsAction } from '../actions/TrialSession/getTrialSessionsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setForHearingAction } from '../actions/CaseDetail/setForHearingAction';
import { setTrialSessionJudgeAction } from '../actions/setTrialSessionJudgeAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateSetForHearingAction } from '../actions/CaseDetail/validateSetForHearingAction';

const showSuccessAlert = [
  clearModalStateAction,
  setAlertSuccessAction,
  setTrialSessionJudgeAction,
  getCaseAction,
  setCaseAction,
];

export const setForHearingSequence = [
  clearScreenMetadataAction,
  startShowValidationAction,
  validateSetForHearingAction,
  {
    error: [setValidationErrorsAction],
    success: [
      showProgressSequenceDecorator([
        setWaitingForResponseAction,
        clearModalAction,
        setForHearingAction,
        getTrialSessionsAction,
        setTrialSessionsAction,
        unsetWaitingForResponseAction,
        showSuccessAlert,
        getConsolidatedCasesByCaseAction,
        setConsolidatedCasesForCaseAction,
      ]),
    ],
  },
];
