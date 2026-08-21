import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getTrialSessionsOnCaseAction } from '../actions/TrialSession/getTrialSessionsOnCaseAction';
import { refreshCaseMetadataAction } from '../actions/refreshCaseMetadataAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setForHearingAction } from '../actions/CaseDetail/setForHearingAction';
import { setTrialSessionJudgeAction } from '../actions/setTrialSessionJudgeAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateSetForHearingAction } from '../actions/CaseDetail/validateSetForHearingAction';

export const setForHearingSequence = [
  clearScreenMetadataAction,
  startShowValidationAction,
  validateSetForHearingAction,
  {
    error: [setValidationErrorsAction],
    success: [
      showProgressSequenceDecorator([
        clearModalAction,
        setForHearingAction,
        clearModalStateAction,
        refreshCaseMetadataAction,
        setTrialSessionJudgeAction,
        getTrialSessionsOnCaseAction,
        setTrialSessionsAction,
        setAlertSuccessAction,
      ]),
    ],
  },
];
