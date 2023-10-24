import { addCaseToTrialSessionAction } from '../actions/CaseDetail/addCaseToTrialSessionAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { getTrialSessionsOnCaseAction } from '../actions/TrialSession/getTrialSessionsOnCaseAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setTrialSessionJudgeAction } from '../actions/setTrialSessionJudgeAction';
import { setTrialSessionsAction } from '../actions/TrialSession/setTrialSessionsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateAddToTrialSessionAction } from '../actions/CaseDetail/validateAddToTrialSessionAction';

const successPath = [
  setCaseAction,
  getTrialSessionsOnCaseAction,
  setTrialSessionsAction,
  clearModalStateAction,
  setAlertSuccessAction,
  setTrialSessionJudgeAction,
];

const errorPath = [clearModalStateAction, setAlertErrorAction];

export const addCaseToTrialSessionSequence = [
  clearScreenMetadataAction,
  startShowValidationAction,
  validateAddToTrialSessionAction,
  {
    error: [setValidationErrorsAction],
    success: [
      showProgressSequenceDecorator([
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
