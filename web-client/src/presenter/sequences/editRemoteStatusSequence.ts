import { editRemoteStatusAction } from '../actions/CaseDetail/editRemoteStatusAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { validateBlockFromTrialAction } from '../actions/CaseDetail/validateBlockFromTrialAction';

export const editRemoteStatusSequence = [
  startShowValidationAction,
  validateBlockFromTrialAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      editRemoteStatusAction,
      setAlertSuccessAction,
      clearModalAction,
      clearModalStateAction,
      setCaseAction,
    ]),
  },
];
