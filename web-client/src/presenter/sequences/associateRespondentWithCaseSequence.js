import { associateRespondentWithCaseAction } from '../actions/ManualAssociation/associateRespondentWithCaseAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';

export const associateRespondentWithCaseSequence = [
  associateRespondentWithCaseAction,
  {
    success: [setAlertSuccessAction, clearModalAction, clearModalStateAction],
  },
];
