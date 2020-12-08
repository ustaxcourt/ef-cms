import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setForHearingAction } from '../actions/CaseDetail/setForHearingAction';
import { setTrialSessionJudgeAction } from '../actions/setTrialSessionJudgeAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
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
        unsetWaitingForResponseAction,
        showSuccessAlert,
      ]),
    ],
  },
];
