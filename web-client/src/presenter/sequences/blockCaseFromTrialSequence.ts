import { blockCaseFromTrialAction } from '../actions/CaseDetail/blockCaseFromTrialAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateBlockFromTrialAction } from '../actions/CaseDetail/validateBlockFromTrialAction';

export const blockCaseFromTrialSequence = [
  startShowValidationAction,
  validateBlockFromTrialAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      blockCaseFromTrialAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
      setCaseAction,
    ]),
  },
];
