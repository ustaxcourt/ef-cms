import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { submitEditPractitionersModalAction } from '../actions/caseAssociation/submitEditPractitionersModalAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const submitEditPractitionersModalSequence = [
  setWaitingForResponseAction,
  submitEditPractitionersModalAction,
  {
    success: [
      setAlertSuccessAction,
      clearModalAction,
      clearFormAction,
      setCasePropFromStateAction,
      getCaseAction,
      setCaseAction,
    ],
  },
  unsetWaitingForResponseAction,
];
