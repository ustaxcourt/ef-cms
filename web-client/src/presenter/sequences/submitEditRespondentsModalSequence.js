import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCasePropFromStateAction } from '../actions/setCasePropFromStateAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { submitEditRespondentsModalAction } from '../actions/caseAssociation/submitEditRespondentsModalAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';

export const submitEditRespondentsModalSequence = [
  setWaitingForResponseAction,
  submitEditRespondentsModalAction,
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
