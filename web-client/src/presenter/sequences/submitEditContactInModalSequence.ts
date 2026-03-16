import { clearModalAction } from '../actions/clearModalAction';
import { setScrollToErrorNotificationAction } from '../actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updateContactInModalAction } from '../actions/updateContactInModalAction';
import { validatePetitionerInModalAction } from '../actions/validatePetitionerInModalAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { clearModalFormSequence } from './clearModalFormSequence';
import { getCaseAction } from '@web-client/presenter/actions/getCaseAction';
import { setCaseAction } from '@web-client/presenter/actions/setCaseAction';

export const submitEditContactInModalSequence = [
  startShowValidationAction,
  validatePetitionerInModalAction,
  {
    error: [
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
    ],
    success: showProgressSequenceDecorator([
      updateContactInModalAction,
      getCaseAction,
      setCaseAction,
      clearModalFormSequence,
      clearModalAction,
    ]),
  },
];
