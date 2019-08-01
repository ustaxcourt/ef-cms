import { associatePractitionerWithCaseAction } from '../actions/ManualAssociation/associatePractitionerWithCaseAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';

export const associatePractitionerWithCaseSequence = [
  associatePractitionerWithCaseAction,
  {
    success: [setAlertSuccessAction, clearModalAction, clearModalStateAction],
  },
];
