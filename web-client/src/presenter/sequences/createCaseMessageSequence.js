import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { clearUsersAction } from '../actions/clearUsersAction';
import { createCaseMessageAction } from '../actions/CaseDetail/createCaseMessageAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateCreateCaseMessageAction } from '../actions/validateCreateCaseMessageAction';

export const createCaseMessageSequence = [
  startShowValidationAction,
  validateCreateCaseMessageAction,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      createCaseMessageAction,
      stopShowValidationAction,
      setAlertSuccessAction,
      clearScreenMetadataAction,
      clearUsersAction,
      clearModalAction,
      clearModalStateAction,
    ]),
  },
];
